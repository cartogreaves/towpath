"""create boats table

Revision ID: e698d72fbd5f
Revises: b60bbabbf413
Create Date: 2024-11-20 00:16:05.043413

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e698d72fbd5f'
down_revision: Union[str, None] = 'b60bbabbf413'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade():
    # Create boats table
    op.create_table(
        'boats',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('latitude', sa.Float(), nullable=True),
        sa.Column('longitude', sa.Float(), nullable=True),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), onupdate=sa.text('now()')),
        
        # Primary key
        sa.PrimaryKeyConstraint('id'),
        
        # Foreign key reference to users table
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        
        # Indexes
        sa.Index('ix_boats_id', 'id'),
        sa.Index('ix_boats_user_id', 'user_id')
    )

def downgrade():
    # Drop boats table
    op.drop_index('ix_boats_user_id')
    op.drop_index('ix_boats_id')
    op.drop_table('boats')