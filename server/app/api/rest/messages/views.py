# server/app/api/messages/views.py


from flask import request, current_app
from flask_restful import Resource
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)
from app.api.rest.messages.models import Message
from app.api.rest.messages.exceptions import TopicNotFound


class SingleMessageViews(Resource):
    @jwt_required
    def post(self, topic_id):
        post_data = request.get_json()
        response_object = {
            "message": "Invalid payload."
        }
        if not post_data:
            return response_object, 400
        message = post_data.get("message") or "Blank"
        current_user = get_jwt_identity()
        try:
            new_message = Message(
                message=message,
                created_by=current_user,
                updated_by=current_user
            )
            new_message.insert(topic_id=topic_id)
            response_object = new_message.json()
            return response_object, 200
        except TopicNotFound as e:
            response_object["message"] = e.args[0]
            return response_object, 404
        except Exception:
            response_object["message"] = "Try again."
            return response_object, 500


class MultipleMessageViews(Resource):
    @jwt_required
    def get(self, topic_id):
        get_data = request.get_json()
        response_object = {
            "message": "Topic does not exists."
        }
        default_page = current_app.config.get("PAGE_COUNT")
        page = get_data.get("page") or default_page
        try:
            (has_next, next_page, messages) = Message.find_all(
                page=page,
                topic_id=topic_id
            )
            response_object = {
                "data": messages,
                "has_next": has_next,
                "next_num": next_page
            }
            return response_object, 200
        except TopicNotFound as e:
            response_object["message"] = e.args[0]
            return response_object, 404
        except Exception:
            response_object["message"] = "Try again."
            return response_object, 500
