# server/app/extensions.py


from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate


bcrypt = Bcrypt()
migrate = Migrate()
jwt = JWTManager()


@jwt.expired_token_loader
def jwt_token_expired():
    return {
        "message": "Signature expired. Please log in again."
    }, 401


@jwt.invalid_token_loader
def jwt_token_invalid(_):
    return {
        "message": "Invalid token. Please log in again."
    }, 401


@jwt.revoked_token_loader
def jwt_token_revoked():
    return {
        "message": "Token has been revoked."
    }, 401


@jwt.token_in_blacklist_loader
def check_if_token_revoked(decoded_token):
    from app.api.users.blacklist import is_token_revoked
    return is_token_revoked(decoded_token)
