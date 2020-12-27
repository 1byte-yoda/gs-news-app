# server/app/__init__.py


import os
from flask import Flask
from flask_redis import FlaskRedis
from fakeredis import FakeStrictRedis
from flask_cors import CORS
from ariadne.constants import PLAYGROUND_HTML
from db import db
from app.api.rest.users.models import User
from app.api.rest.topics.models import Topic
from app.api.rest.messages.models import Message
from app.extensions import (
    bcrypt,
    migrate,
    jwt,
    redis_client,
    graphql_client
)


def create_app(script_info=None):
    """Application factory."""
    # instantiate the app
    app = Flask(__name__)

    # enable cors
    CORS(app)

    # set config
    app_settings = os.getenv("APP_SETTINGS")
    app.config.from_object(app_settings)

    # set up extensions
    db.init_app(app)
    bcrypt.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    graphql_client.init_app(app)

    if app.config["TESTING"]:
        redis_store = FlaskRedis.from_custom_provider(FakeStrictRedis)
    else:
        redis_store = redis_client
    redis_store.init_app(app)

    # register blueprints
    from app.api.rest.users import users_blueprint
    app.register_blueprint(users_blueprint)
    from app.api.rest.topics import topics_blueprint
    app.register_blueprint(topics_blueprint)
    from app.api.rest.messages import messages_blueprint
    app.register_blueprint(messages_blueprint)

    if app.debug:
        @app.route("/graphql", methods=["GET"])
        def gql_playground():
            """User interface for writing graphql queries."""
            return PLAYGROUND_HTML, 200

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

    @app.before_first_request
    def create_tables():
        """Create all tables in the database, if not existing."""
        db.create_all()

    return app
