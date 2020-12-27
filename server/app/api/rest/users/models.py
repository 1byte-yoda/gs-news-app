# server/app/api/rest/users/models.py


import datetime
from hashlib import md5
from typing import Dict
import uuid
from sqlalchemy.dialects.postgresql import UUID
from app.extensions import bcrypt
from db import db
from db import ISO8601DateTime


class User(db.Model):
    __tablename__ = "users"
    id = db.Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        unique=True
    )
    name = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(128), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
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
    topics = db.relationship(
        "Topic",
        foreign_keys="Topic.created_by",
        uselist=True,
        lazy="dynamic"
    )
    messages = db.relationship(
        "Message",
        foreign_keys="Message.created_by",
        uselist=True,
        lazy="dynamic"
    )

    def __init__(self, name, email, password):
        self.name = name
        self.email = email
        self.password = password

    def json(self) -> Dict:
        return {
            "id": str(self.id),
            "email": self.email,
            "name": self.name,
            "avatar": self.avatar,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "total_topics": self.topics.count(),
            "total_messages": self.messages.count()
        }

    @property
    def password(self):
        """Protect password attribute."""
        raise AttributeError("password is not a readable attribute")

    @password.setter
    def password(self, password: str) -> None:
        """Generate a hash equivalent of a given password."""
        self.password_hash = bcrypt.generate_password_hash(password).decode()

    @property
    def avatar(self):
        avatar_url_link = "https://www.gravatar.com/avatar/{}?d=identicon&s={}"
        digest = md5(self.email.lower().encode("utf-8")).hexdigest()
        return avatar_url_link.format(digest, 128)

    @classmethod
    def find(cls, **kwargs) -> "User":
        """Find a database entry that matches given keyword argument."""
        keys = list(kwargs.keys())
        if (
            len(keys) == 1
            and keys[0] in cls.__table__.columns
        ):
            return cls.query.filter_by(**kwargs).first()

    def insert(self) -> None:
        """Insert into the database."""
        db.session.add(self)
        db.session.commit()
