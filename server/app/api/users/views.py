# server/app/api/users/views.py


from sqlalchemy import exc
from flask import request
from flask_restful import Resource
from db import db
from app.api.users.models import User


class UsersRegister(Resource):
    def post(self):
        post_data = request.get_json()
        response_object = {
            "message": "Invalid payload."
        }
        if not post_data:
            return response_object, 400
        email = post_data.get("email")
        try:
            user = User.find(email=email)
            if not user:
                user = User(**post_data)
                user.insert()
                added_user = User.find(
                    email=post_data["email"]
                )
                response_object = added_user.json()
                return response_object, 201
            else:
                response_object["message"] = (
                    "Sorry. That email already exists."
                )
                return response_object, 400
        except exc.IntegrityError:
            db.session.rollback()
            return response_object, 400
        except (exc.IntegrityError, ValueError):
            db.session.rollback()
            return response_object, 400
