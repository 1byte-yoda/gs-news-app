# server/app/api/topics/__init__.py


from flask import Blueprint
from flask_restful import Api
from app.api.topics.views import SingleTopicViews


topics_blueprint = Blueprint("topics", __name__)
topics_api = Api(topics_blueprint)

topics_api.add_resource(SingleTopicViews, "/topic")
