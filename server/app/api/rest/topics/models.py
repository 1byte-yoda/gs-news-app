# server/app/api/rest/topics/models.py


import datetime
from typing import Dict, List
import uuid
from flask import current_app
from sqlalchemy import func
from sqlalchemy.dialects.postgresql import UUID
from db import ISO8601DateTime
from app.api.rest.users.models import User
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
    messages = db.relationship("Message", lazy="dynamic")
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
            "updated_by": self.updator.json(),
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "deleted_at": self.deleted_at,
            "messages_count": len(self.messages.all()),
            "messages": self.paginated_messages
        }

    @property
    def paginated_messages(self) -> List[Dict]:
        """Paginated messages representation."""
        from app.api.rest.messages.models import Message
        _ordered_msgs = self.messages.order_by(
            Message.created_at.desc()
        )
        _paginated_msgs = _ordered_msgs.paginate(
            page=1,
            per_page=current_app.config.get("COMMENTS_PER_PAGE"),
            error_out=False
        ).items
        return [message.json() for message in _paginated_msgs]

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
        if not page:
            raise ValueError
        topics = (
            cls.query.filter_by(deleted_at=None)
            .order_by(func.lower(cls.subject))
            .paginate(
                page=page,
                per_page=current_app.config.get("TOPICS_PER_PAGE"),
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

    def delete(self) -> None:
        """Mark a topic as deleted in the database."""
        self.deleted_at = datetime.datetime.now()
        db.session.commit()
