"""add_avatar_column

Revision ID: b60bbabbf413
Revises: 478e4ac97d64
Create Date: 2024-11-19 21:50:11.612492

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b60bbabbf413'
down_revision: Union[str, None] = '478e4ac97d64'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade():
    # Add avatar column with default emoji
    op.add_column('users', 
        sa.Column('avatar', sa.String(), nullable=True, server_default='👤')
    )

def downgrade():
    # Remove avatar column
    op.drop_column('users', 'avatar')
