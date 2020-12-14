# server/app/__init__.py


import os
from flask import Flask, jsonify, Blueprint
from db import db
from app.api.users.models import User
from app.api.users import users_blueprint


def create_app(script_info=None):
    """Application factory."""
    # instantiate the app
    app = Flask(__name__)

    # set config
    app_settings = os.getenv("APP_SETTINGS")
    app.config.from_object(app_settings)

    # set up extensions
    db.init_app(app)

    # register blueprints
    app.register_blueprint(health_blueprint)
    app.register_blueprint(users_blueprint)

    # shell context for flask cli
    @app.shell_context_processor
    def ctx():
        return {"app": app, "db": db, "User": User}

    return app


health_blueprint = Blueprint("health", __name__)


@health_blueprint.route("/ping", methods=["GET"])
def ping_pong():
    """Check application"s health"""
    return jsonify({
        "status": "success",
        "message": "pong!"
    })
