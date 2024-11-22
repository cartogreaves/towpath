"""initial_migration

Revision ID: 76a11f844571
Revises: 
Create Date: 2024-11-21 23:36:38.311499

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa



# revision identifiers, used by Alembic.
revision: str = '76a11f844571'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade():
    # Create users table
    op.create_table('users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('username', sa.String(), nullable=False),
        sa.Column('hashed_password', sa.String(), nullable=False),
        sa.Column('avatar', sa.String(), server_default='👤'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_users_email', 'users', ['email'], unique=True)
    op.create_index('ix_users_username', 'users', ['username'], unique=True)
    
    # Create boats table
    op.create_table('boats',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('latitude', sa.Float(), nullable=True),
        sa.Column('longitude', sa.Float(), nullable=True),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_boats_id', 'boats', ['id'])
    
    # Create friendships table
    op.create_table('friendships',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('friend_id', sa.Integer(), nullable=False),
        sa.Column('status', sa.String(10), nullable=False, server_default='pending'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['friend_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.CheckConstraint("status IN ('pending', 'accepted', 'rejected')", name='valid_status')
    )
    op.create_index('idx_friendships_user_id', 'friendships', ['user_id'])
    op.create_index('idx_friendships_friend_id', 'friendships', ['friend_id'])
    op.create_unique_constraint('uq_friendships_user_friend', 'friendships', ['user_id', 'friend_id'])

def downgrade():
    op.drop_table('friendships')
    op.drop_table('boats')
    op.drop_table('users')