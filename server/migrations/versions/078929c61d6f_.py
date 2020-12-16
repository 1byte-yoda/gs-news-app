"""empty message

Revision ID: 078929c61d6f
Revises: 8e8b3d773dc6
Create Date: 2020-12-16 10:28:04.238497

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from app.api.utils import ISO8601DateTime


# revision identifiers, used by Alembic.
revision = '078929c61d6f'
down_revision = '8e8b3d773dc6'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('topics',
    sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('subject', sa.String(length=128), nullable=True),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('created_by', postgresql.UUID(as_uuid=True), nullable=True),
    sa.Column('updated_by', postgresql.UUID(as_uuid=True), nullable=True),
    sa.Column('created_at', ISO8601DateTime(), nullable=False),
    sa.Column('updated_at', ISO8601DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['created_by'], ['users.id'], ),
    sa.ForeignKeyConstraint(['updated_by'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('id')
    )
    op.drop_table('user_token')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user_token',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('jti', sa.VARCHAR(length=36), autoincrement=False, nullable=False),
    sa.Column('token_type', sa.VARCHAR(length=10), autoincrement=False, nullable=False),
    sa.Column('user_identity', sa.VARCHAR(length=50), autoincrement=False, nullable=False),
    sa.Column('revoked', sa.BOOLEAN(), autoincrement=False, nullable=False),
    sa.Column('expires', postgresql.TIMESTAMP(), autoincrement=False, nullable=False),
    sa.PrimaryKeyConstraint('id', name='user_token_pkey')
    )
    op.drop_table('topics')
    # ### end Alembic commands ###
