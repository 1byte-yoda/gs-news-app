# server/app/api/rest/topics/__init__.py


from flask import Blueprint
from flask_restful import Api
from app.api.rest.topics.views import (
    CreateTopicView,
    SingleTopicViews,
    MultipleTopicViews
)


topics_blueprint = Blueprint("topics", __name__)
topics_api = Api(topics_blueprint)

topics_api.add_resource(CreateTopicView, "/topic")
topics_api.add_resource(SingleTopicViews, "/topic/<string:id>")
topics_api.add_resource(MultipleTopicViews, "/topics")
