# server/app/api/topics/models.py


import datetime
from typing import Dict
import uuid
from sqlalchemy.dialects.postgresql import UUID
from app.api.utils import ISO8601DateTime
from app import db


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
        default=datetime.datetime.now
    )

    def __init__(self, message):
        self.message = message

    def json(self) -> Dict:
        return {
            "id": str(self.id),
            "topic_id": str(self.topic_id),
            "message": self.description,
            "created_by": str(self.created_by),
            "updated_by": str(self.updated_by),
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }
