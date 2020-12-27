# server/app/api/topics/models.py


import datetime
from typing import Dict, List
import uuid
from flask import current_app
from sqlalchemy.dialects.postgresql import UUID
from db import ISO8601DateTime
from app.api.rest.topics.models import Topic
from app.api.rest.users.models import User
from app.api.rest.messages.exceptions import TopicNotFound
from db import db


class Message(db.Model):
    __tablename__ = "messages"
    id = db.Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        unique=True
    )
    topic_id = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("topics.id")
    )
    message = db.Column(db.Text, nullable=True)
    created_by = db.Column(
        UUID(as_uuid=True),
        db.ForeignKey("users.id")
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
    creator = db.relationship(
        User,
        primaryjoin=(created_by == User.id)
    )
    updator = db.relationship(
        User,
        primaryjoin=(updated_by == User.id)
    )

    def __init__(self, message, created_by, updated_by):
        self.message = message
        self.created_by = created_by
        self.updated_by = updated_by

    def json(self) -> Dict:
        return {
            "id": str(self.id),
            "topic_id": str(self.topic_id),
            "message": self.message,
            "created_by": self.creator.json(),
            "updated_by": self.updator.json(),
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }

    @classmethod
    def find(cls, **kwargs) -> "Message":
        """Find a database entry that matches given keyword argument."""
        keys = list(kwargs.keys())
        if (
            len(keys) == 1
            and keys[0] in cls.__table__.columns
        ):
            return cls.query.filter_by(**kwargs).first()

    @classmethod
    def find_all(cls, topic_id: str, page: int) -> List[Dict]:
        """Find all messages from a given topic."""
        topic = Topic.find(id=uuid.UUID(topic_id))
        if topic:
            if not topic.deleted_at:
                messages = (
                    cls.query.filter_by(topic_id=topic.id.__str__())
                    .order_by(cls.created_at.desc())
                    .paginate(
                        page=page,
                        per_page=current_app.config.get("COMMENTS_PER_PAGE"),
                        error_out=False
                    )
                )
                pagination_data = (
                    messages.has_next,
                    messages.next_num,
                    [message.json() for message in messages.items]
                )
                return pagination_data
        else:
            raise TopicNotFound("Topic does not exists.")

    def insert(self, topic_id: str) -> None:
        """Insert a new message in the database."""
        topic = Topic.find(id=topic_id)
        if topic:
            if not topic.deleted_at:
                topic.messages.append(self)
                db.session.commit()
        else:
            raise TopicNotFound("Topic does not exists.")
