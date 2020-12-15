from datetime import datetime, timezone

from sqlalchemy.orm.exc import NoResultFound
from flask_jwt_extended import decode_token
from flask import current_app

from app.api.users.exceptions import TokenNotFound
from app.api.users.models import UserToken
from db import db


def _epoch_utc_to_datetime(epoch_utc):
    """
    Helper function for converting epoch timestamps (as stored in JWTs) into
    python datetime objects (which are easier to use with sqlalchemy).
    """
    return datetime.fromtimestamp(epoch_utc, tz=timezone.utc)


def add_token_to_database(encoded_token, identity_claim):
    """
    Adds a new token to the database. It is not revoked when it is added.
    :param identity_claim:
    """
    if not current_app.config["JWT_BLACKLIST_ENABLED"]:
        return
    decoded_token = decode_token(encoded_token)
    jti = decoded_token['jti']
    token_type = decoded_token['type']
    user_identity = decoded_token[identity_claim]
    expires = _epoch_utc_to_datetime(decoded_token['exp'])
    revoked = False

    db_token = UserToken(
        jti=jti,
        token_type=token_type,
        user_identity=user_identity,
        expires=expires,
        revoked=revoked,
    )
    db.session.add(db_token)
    db.session.commit()


def is_token_revoked(decoded_token):
    """
    Checks if the given token is revoked or not. Because we are adding all the
    tokens that we create into this database, if the token is not present
    in the database we are going to consider it revoked, as we don't know where
    it was created.
    """
    jti = decoded_token['jti']
    try:
        token = UserToken.query.filter_by(jti=jti).first()
        return token.revoked if token else False
    except NoResultFound:
        return True


def revoke_user(user_identity):
    """
    Revoke a user.
    """
    users = UserToken.query.filter_by(
        user_identity=user_identity,
        revoked="f"
    ).all()
    for u in users:
        u.revoked = True
    db.session.commit()


def revoke_token(jti, user):
    """Revokes the given jti."""
    jti = UserToken.query.filter_by(jti=jti, user_identity=user).first()
    if jti:
        jti.revoked = True
        db.session.commit()


def unrevoke_token(token_id, user):
    """
    Unrevokes the given token. Raises a TokenNotFound error if the token does
    not exist in the database
    """
    try:
        token = UserToken.query.filter_by(
            id=token_id,
            user_identity=user
        ).one()
        token.revoked = False
        db.session.commit()
    except NoResultFound:
        raise TokenNotFound("Could not find the token {}".format(token_id))


def prune_database():
    """
    Delete tokens that have expired from the database.
    How (and if) you call this is entirely up you. You could expose it to an
    endpoint that only administrators could call, you could run it as a cron,
    set it up with flask cli, etc.
    """
    now = datetime.now()
    expired = UserToken.query.filter(UserToken.expires < now).all()
    for token in expired:
        db.session.delete(token)
    db.session.commit()
