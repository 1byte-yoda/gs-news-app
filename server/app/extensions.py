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
