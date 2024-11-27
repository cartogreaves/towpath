"""map_features_schema

Revision ID: 983359def950
Revises: 92cc4dbd2324
Create Date: 2024-11-27 09:06:32.342446

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy import text
from sqlalchemy.dialects.postgresql import UUID
import uuid


# revision identifiers, used by Alembic.
revision: str = '983359def950'
down_revision: Union[str, None] = '92cc4dbd2324'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def create_standard_waterway_table(table_name):
    """Helper function to create standard waterway feature tables"""
    op.create_table(
        table_name,
        sa.Column('uuid', UUID(as_uuid=True), primary_key=True, server_default=sa.text('uuid_generate_v4()')),
        sa.Column('object_id', sa.Integer, nullable=False),
        sa.Column('sap_func_loc', sa.String),
        sa.Column('sap_description', sa.String),
        sa.Column('sap_object_type', sa.String),
        sa.Column('global_id', sa.String),
        sa.Column('waterway_name', sa.String),
        sa.Column('geom', sa.String),
        schema='features'
    )
    
    # Create indexes
    op.create_index(
        f'idx_{table_name}_uuid',
        table_name,
        ['uuid'],
        unique=True,
        schema='features'
    )
    op.create_index(
        f'idx_{table_name}_object_id',
        table_name,
        ['object_id'],
        schema='features'
    )

def upgrade():
    # Create extensions
    op.execute('CREATE EXTENSION IF NOT EXISTS postgis;')
    op.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
    
    # Create features schema
    op.execute('CREATE SCHEMA IF NOT EXISTS features;')
    
    # Create canals table (special case due to different columns)
    op.create_table(
        'canals',
        sa.Column('uuid', UUID(as_uuid=True), primary_key=True, server_default=sa.text('uuid_generate_v4()')),
        sa.Column('object_id', sa.Integer, nullable=False),
        sa.Column('functional_location', sa.String),
        sa.Column('sap_canal_code', sa.String),
        sa.Column('name', sa.String),
        sa.Column('sap_nav_status', sa.String),
        sa.Column('region', sa.String),
        sa.Column('global_id', sa.String),
        sa.Column('pub_regional_name', sa.String),
        sa.Column('geom', sa.String),
        schema='features'
    )
    
    # Create indexes for canals
    op.create_index(
        'idx_canals_uuid',
        'canals',
        ['uuid'],
        unique=True,
        schema='features'
    )
    op.create_index(
        'idx_canals_object_id',
        'canals',
        ['object_id'],
        schema='features'
    )
    
    # Create standard waterway feature tables
    standard_tables = [
        'slipways', 'winding_holes', 'wharves', 'dry_docks', 'sluices',
        'weirs', 'tunnel_portals', 'aqueducts', 'boat_lifts', 'culverts'
    ]
    
    for table in standard_tables:
        create_standard_waterway_table(table)
    
    # Create bridges and locks (special cases due to angle column)
    for table in ['bridges', 'locks']:
        op.create_table(
            table,
            sa.Column('uuid', UUID(as_uuid=True), primary_key=True, server_default=sa.text('uuid_generate_v4()')),
            sa.Column('object_id', sa.Integer, nullable=False),
            sa.Column('sap_func_loc', sa.String),
            sa.Column('sap_description', sa.String),
            sa.Column('sap_object_type', sa.String),
            sa.Column('angle', sa.Integer),
            sa.Column('global_id', sa.String),
            sa.Column('waterway_name', sa.String),
            sa.Column('geom', sa.String),
            schema='features'
        )
        
        # Create indexes
        op.create_index(
            f'idx_{table}_uuid',
            table,
            ['uuid'],
            unique=True,
            schema='features'
        )
        op.create_index(
            f'idx_{table}_object_id',
            table,
            ['object_id'],
            schema='features'
        )

    # After all tables are created, alter the geometry columns and add spatial indexes
    tables = ['canals'] + standard_tables + ['bridges', 'locks']
    
    for table in tables:
        # Convert geom column to geometry type
        op.execute(f'ALTER TABLE features.{table} '
                  f'ALTER COLUMN geom TYPE geometry USING ST_SetSRID(geom::geometry, 4326);')
        
        # Create spatial index
        op.execute(f'CREATE INDEX idx_{table}_geom ON features.{table} USING GIST (geom);')

def downgrade():
    # Drop all feature tables
    tables = [
        'canals', 'slipways', 'winding_holes', 'wharves', 'dry_docks',
        'sluices', 'weirs', 'tunnel_portals', 'aqueducts', 'boat_lifts',
        'locks', 'bridges', 'culverts'
    ]
    
    for table in tables:
        op.drop_table(table, schema='features')
    
    # Drop schema
    op.execute('DROP SCHEMA IF EXISTS features CASCADE;')