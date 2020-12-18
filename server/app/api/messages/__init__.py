# server/app/api/messages/__init__.py


from flask import Blueprint
from flask_restful import Api
from app.api.messages.views import (
    SingleMessageViews,
    MultipleMessageViews
)


messages_blueprint = Blueprint("messages", __name__)
messages_api = Api(messages_blueprint)

messages_api.add_resource(SingleMessageViews, "/topic/<string:topic_id>/message")
messages_api.add_resource(MultipleMessageViews, "/topic/<string:topic_id>/messages")
