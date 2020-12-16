# server/app/api/topics/views.py


from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.api.topics.models import Topic
from app import db


class SingleTopicViews(Resource):
    @jwt_required
    def post(self):
        post_data = request.get_json()
        response_object = {
            "message": "Invalid payload."
        }
        if not post_data:
            return response_object, 400
        subject = post_data.get("subject")
        description = post_data.get("description")
        keys = ["subject", "description"]
        post_keys = post_data.keys()
        has_invalid_keys = [k not in keys for k in post_keys]
        has_unknown_keys = len(post_keys) != len(keys)
        if any(has_invalid_keys) or has_unknown_keys:
            return response_object, 400
        try:
            current_user = get_jwt_identity()
            topic = Topic(
                subject=subject,
                description=description,
                created_by=current_user,
                updated_by=current_user
            )
            topic.insert()
            new_topic = Topic.find(id=topic.id)
            response_object = new_topic.json()
            return response_object, 201
        except (ValueError, TypeError):
            db.session.rollback()
            return response_object, 400
        except Exception:
            db.session.rollback()
            response_object["message"] = "Try again"
            return response_object, 500
