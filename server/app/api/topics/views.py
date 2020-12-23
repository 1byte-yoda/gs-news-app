# server/app/api/topics/views.py


from flask import request
from flask_restful import Resource
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)
from app.api.topics.models import Topic
from db import db


class CreateTopicView(Resource):
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
            db.session.flush()
            return response_object, 400
        except Exception:
            db.session.rollback()
            db.session.flush()
            response_object["message"] = "Try again."
            return response_object, 500


class SingleTopicViews(Resource):
    @jwt_required
    def get(self, id):
        response_object = {
            "message": "Invalid payload."
        }
        try:
            topic = Topic.find(id=id)
            if not topic or topic.deleted_at:
                return {
                    "message": "Topic does not exists."
                }, 404
            response_object = {
                "data": topic.json()
            }
            return response_object, 200
        except (ValueError, TypeError):
            db.session.rollback()
            db.session.flush()
            return response_object, 400
        except Exception:
            response_object["message"] = "Try again."
            db.session.rollback()
            db.session.flush()
            return response_object, 500

    @jwt_required
    def post(self, id):
        current_user = get_jwt_identity()
        topic = Topic.find(id=id)
        if not topic:
            return {
                "message": "Topic does not exists."
            }, 404
        current_user = get_jwt_identity()
        if str(current_user) != str(topic.created_by):
            return {
                "message": "You do not have permission to do that."
            }, 401
        post_data = request.get_json()
        response_object = {
            "message": "Invalid payload."
        }
        if not post_data:
            return response_object, 400
        keys = ["subject", "description"]
        post_keys = post_data.keys()
        has_unknown_keys = len(post_keys) != len(keys)
        if has_unknown_keys:
            return response_object, 400
        subject = post_data.get("subject")
        description = post_data.get("description")
        try:
            if subject:
                topic.subject = subject
            if description:
                topic.description = description
            db.session.commit()
            response_object = topic.json()
            return response_object, 200
        except (ValueError, TypeError):
            db.session.rollback()
            db.session.flush()
            return response_object, 400
        except Exception:
            db.session.rollback()
            db.session.flush()
            response_object["message"] = "Try again."
            return response_object, 500

    @jwt_required
    def delete(self, id):
        response_object = {
            "message": "Invalid payload."
        }
        current_user = get_jwt_identity()
        topic = Topic.find(id=id)
        if not topic or topic.deleted_at:
            response_object["message"] = "Topic does not exists."
            return response_object, 404
        current_user = get_jwt_identity()
        if str(current_user) != str(topic.created_by):
            response_object["message"] = (
                "You do not have permission to do that."
            )
            return response_object, 401
        try:
            topic.delete()
            return {"success": True}, 202
        except Exception:
            db.session.rollback()
            db.session.flush()
            response_object["message"] = "Try again."
            return response_object, 500


class MultipleTopicViews(Resource):
    @jwt_required
    def get(self):
        get_data = request.get_json()
        response_object = {
            "message": "Invalid payload."
        }
        page = get_data.get("page")
        try:
            (has_next, next_num, topics) = Topic.find_all(page=page)
            response_object = {
                "data": topics,
                "has_next": has_next,
                "next_num": next_num
            }
            return response_object, 200
        except (ValueError, TypeError):
            db.session.rollback()
            db.session.flush()
            return response_object, 400
        except Exception:
            response_object["message"] = "Try again."
            db.session.rollback()
            db.session.flush()
            return response_object, 500
