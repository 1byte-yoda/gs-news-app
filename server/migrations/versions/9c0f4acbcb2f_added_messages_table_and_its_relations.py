"""added messages table and its relations

Revision ID: 9c0f4acbcb2f
Revises: a0300a5a2e7a
Create Date: 2020-12-16 12:22:27.802450

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9c0f4acbcb2f'
down_revision = 'a0300a5a2e7a'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_unique_constraint(None, 'topics', ['id'])
    op.create_unique_constraint(None, 'users', ['id'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'users', type_='unique')
    op.drop_constraint(None, 'topics', type_='unique')
    # ### end Alembic commands ###