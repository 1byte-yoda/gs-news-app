"""Added deleted_at column in the topics table to mark a topic as deleted.

Revision ID: b2606be714a7
Revises: b034ed7cedcd
Create Date: 2020-12-17 09:22:13.574433

"""
from alembic import op
import sqlalchemy as sa
from app.api.utils import ISO8601DateTime


# revision identifiers, used by Alembic.
revision = 'b2606be714a7'
down_revision = 'b034ed7cedcd'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_unique_constraint(None, 'messages', ['id'])
    op.add_column('topics', sa.Column('deleted_at', ISO8601DateTime(), nullable=True))
    op.create_unique_constraint(None, 'topics', ['id'])
    op.create_unique_constraint(None, 'users', ['id'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'users', type_='unique')
    op.drop_constraint(None, 'topics', type_='unique')
    op.drop_column('topics', 'deleted_at')
    op.drop_constraint(None, 'messages', type_='unique')
    # ### end Alembic commands ###