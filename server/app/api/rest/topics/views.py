# server/app/api/rest/topics/views.py


from flask import request, current_app
import sqlalchemy
from flask_restful import Resource
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)
from app.api.rest.topics.models import Topic
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
        try:
            if any(has_invalid_keys) or has_unknown_keys:
                raise ValueError
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
        except ValueError:
            db.session.rollback()
            db.session.flush()
            return response_object, 400


class SingleTopicViews(Resource):
    @jwt_required
    def get(self, id):
        response_object = {
            "message": "Invalid ID."
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
        except sqlalchemy.exc.DataError:
            db.session.rollback()
            db.session.flush()
            return response_object, 400

    @jwt_required
    def patch(self, id):
        post_data = request.get_json()
        response_object = {
            "message": "Invalid payload."
        }
        if not post_data:
            return response_object, 400
        keys = ["subject", "description"]
        post_keys = post_data.keys()
        has_unknown_keys = len(post_keys) != len(keys)
        has_invalid_keys = [k not in keys for k in post_keys]
        subject = post_data.get("subject")
        description = post_data.get("description")
        try:
            if any(has_invalid_keys) or has_unknown_keys:
                raise ValueError
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
            topic.subject = subject
            topic.description = description
            db.session.commit()
            response_object = topic.json()
            return response_object, 200
        except (ValueError, sqlalchemy.exc.DataError):
            db.session.rollback()
            db.session.flush()
            return response_object, 400

    @jwt_required
    def delete(self, id):
        response_object = {
            "message": "Invalid payload."
        }
        try:
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
            topic.delete()
            return {"success": True}, 202
        except sqlalchemy.exc.DataError:
            db.session.rollback()
            db.session.flush()
            return response_object, 400


class MultipleTopicViews(Resource):
    @jwt_required
    def get(self):
        get_data = request.get_json()
        response_object = {
            "message": "Invalid payload."
        }
        if not get_data:
            return response_object, 400
        default_page = current_app.config.get("PAGE_COUNT")
        page = get_data.get("page") or default_page
        try:
            (has_next, next_num, topics) = Topic.find_all(page=page)
            response_object = {
                "data": topics,
                "has_next": has_next,
                "next_num": next_num
            }
            return response_object, 200
        except ValueError:
            db.session.rollback()
            db.session.flush()
            return response_object, 400
