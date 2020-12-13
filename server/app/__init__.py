# server/app/__init__.py


import os
from flask import Flask, jsonify, Blueprint
from db import db


def create_app(script_info=None):
    # instantiate the app
    app = Flask(__name__)

    # set config
    app_settings = os.getenv('APP_SETTINGS')
    app.config.from_object(app_settings)


    # set up extensions
    db.init_app(app)

    # register blueprints
    app.register_blueprint(health_blueprint)

    # shell context for flask cli
    app.shell_context_processor({'app': app, 'db': db})
    return app


health_blueprint = Blueprint("health", __name__)


@health_blueprint.route('/ping', methods=['GET'])
def ping_pong():
    return jsonify({
        'status': 'success',
        'message': 'pong!'
    })