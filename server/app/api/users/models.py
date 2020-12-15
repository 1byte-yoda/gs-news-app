# server/app/api/users/models.py


import datetime
from typing import Dict
import uuid
from sqlalchemy.dialects.postgresql import UUID
from app import db, bcrypt
from app.api.utils import ISO8601DateTime


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
        default=datetime.datetime.now
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
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }

    @property
    def password(self):
        """Protect password attribute."""
        raise AttributeError("password is not a readable attribute")

    @password.setter
    def password(self, password: str) -> None:
        """Generate a hash equivalent of a given password."""
        self.password_hash = bcrypt.generate_password_hash(password).decode()

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


class UserToken(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False)
    token_type = db.Column(db.String(10), nullable=False)
    user_identity = db.Column(db.String(50), nullable=False)
    revoked = db.Column(db.Boolean, nullable=False)
    expires = db.Column(db.DateTime, nullable=False)

    def json(self):
        return {
            'token_id': self.id,
            'jti': self.jti,
            'token_type': self.token_type,
            'user_identity': self.user_identity,
            'revoked': self.revoked,
            'expires': self.expires
        }
