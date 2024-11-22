"""boat_share_update

Revision ID: 92cc4dbd2324
Revises: 76a11f844571
Create Date: 2024-11-21 23:53:48.298998

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '92cc4dbd2324'
down_revision: Union[str, None] = '76a11f844571'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade():
    # Add share_location_with_friends column to boats table
    op.add_column('boats', sa.Column('share_location_with_friends', sa.Boolean(), server_default='false', nullable=False))

def downgrade():
    op.drop_column('boats', 'share_location_with_friends')