# server/app/api/topics/models.py


import datetime
from typing import Dict, List
import uuid
from flask import current_app
from sqlalchemy.dialects.postgresql import UUID
from app.api.utils import ISO8601DateTime
from app.api.users.models import User
from db import db


class Topic(db.Model):
    __tablename__ = "topics"
    id = db.Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        unique=True
    )
    subject = db.Column(db.String(128), nullable=True)
    description = db.Column(db.Text, nullable=True)
    created_by = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("users.id"),
    )
    updated_by = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("users.id"),
    )
    created_at = db.Column(
        ISO8601DateTime,
        nullable=False,
        default=datetime.datetime.now
    )
    updated_at = db.Column(
        ISO8601DateTime,
        nullable=False,
        default=datetime.datetime.now,
        onupdate=datetime.datetime.now
    )
    deleted_at = db.Column(
        ISO8601DateTime,
        nullable=True
    )
    messages = db.relationship("Message")
    creator = db.relationship(
        User,
        primaryjoin=(created_by == User.id)
    )
    updator = db.relationship(
        User,
        primaryjoin=(updated_by == User.id)
    )

    def __init__(self, subject, description, created_by, updated_by):
        self.subject = subject
        self.description = description
        self.created_by = created_by
        self.updated_by = updated_by

    def json(self) -> Dict:
        return {
            "id": str(self.id),
            "subject": self.subject,
            "description": self.description,
            "created_by": self.creator.json(),
            "updated_by": self.creator.json(),
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "deleted_at": self.deleted_at,
            "messages": [m.json() for m in self.messages]
        }

    @classmethod
    def find(cls, **kwargs) -> "Topic":
        """Find a database entry that matches given keyword argument."""
        keys = list(kwargs.keys())
        if (
            len(keys) == 1
            and keys[0] in cls.__table__.columns
        ):
            return cls.query.filter_by(**kwargs).first()

    @classmethod
    def find_all(cls, page: int) -> List[Dict]:
        """Find all topics in the database that are not deleted yet."""
        topics = (
            cls.query.filter_by(deleted_at=None)
            .order_by(cls.subject.asc())
            .paginate(
                page=page,
                per_page=current_app.config.get("POSTS_PER_PAGE"),
                error_out=False
            )
        )
        pagination_data = (
            topics.has_next,
            topics.next_num,
            [topic.json() for topic in topics.items]
        )
        return pagination_data

    def insert(self) -> None:
        """Insert into the database."""
        db.session.add(self)
        db.session.commit()

    def delete(self):
        """Mark a topic as deleted in the database."""
        self.deleted_at = datetime.datetime.now()
        db.session.commit()
