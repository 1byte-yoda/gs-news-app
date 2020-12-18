# server/app/__init__.py


import os
from flask import Flask
from flask_redis import FlaskRedis
from fakeredis import FakeStrictRedis
from db import db
from app.api.users.models import User
from app.api.topics.models import Topic
from app.api.messages.models import Message
from app.api import (
    ping_pong,
    graphql_playground,
    graphql_server
)
from app.extensions import (
    bcrypt,
    migrate,
    jwt,
    redis_client
)


def create_app(script_info=None):
    """Application factory."""
    # instantiate the app
    app = Flask(__name__)

    # set config
    app_settings = os.getenv("APP_SETTINGS")
    app.config.from_object(app_settings)

    # set up extensions
    db.init_app(app)
    bcrypt.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    if app.config["TESTING"]:
        redis_store = FlaskRedis.from_custom_provider(FakeStrictRedis)
    else:
        redis_store = redis_client
    redis_store.init_app(app)

    # register blueprints
    from app.api.users import users_blueprint
    app.register_blueprint(users_blueprint)
    from app.api.topics import topics_blueprint
    app.register_blueprint(topics_blueprint)
    from app.api.messages import messages_blueprint
    app.register_blueprint(messages_blueprint)

    # add core application routes
    app.add_url_rule("/ping", methods=["GET"], view_func=ping_pong)
    app.add_url_rule("/graphql", methods=["GET"], view_func=graphql_playground)
    app.add_url_rule("/graphql", methods=["POST"], view_func=graphql_server)

    # shell context for flask cli
    @app.shell_context_processor
    def ctx():
        return {
            "app": app,
            "db": db,
            "User": User,
            "Topic": Topic,
            "Message": Message,
            "redis_store": redis_store
        }

    return app
