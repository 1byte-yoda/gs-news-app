# server/app/extensions.py


from gql import GQL
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_redis import FlaskRedis


bcrypt = Bcrypt()
migrate = Migrate()
jwt = JWTManager()
redis_client = FlaskRedis()
graphql_client = GQL()


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
        "message": "Invalid token. Please log in again."
    }, 401


@jwt.token_in_blacklist_loader
def check_if_token_revoked(decoded_token):
    """Filter out revoked token from accessing protected routes."""
    identity = decoded_token['identity']
    jti = decoded_token['jti']
    jti2 = redis_client.get(identity)
    if jti2:
        if jti2.decode() == "inactive":
            return True
        if jti2.decode() == jti:
            return False
    return True
