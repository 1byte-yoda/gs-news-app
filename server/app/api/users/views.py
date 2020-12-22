# server/app/api/users/views.py


from sqlalchemy import exc
from flask import request, current_app
from flask_restful import Resource
from flask_jwt_extended import (
    jwt_required,
    get_raw_jwt,
    get_jti,
    create_access_token
)
from db import db
from app.extensions import bcrypt, redis_client
from app.api.users.models import User


class UserRegister(Resource):
    def post(self):
        post_data = request.get_json()
        response_object = {
            "message": "Invalid payload."
        }
        if not post_data:
            return response_object, 400
        email = post_data.get("email")
        password = post_data.get("password")
        name = post_data.get("name")
        try:
            user = User.find(email=email)
            if not user:
                user = User(name=name, email=email, password=password)
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
        except (exc.IntegrityError, ValueError, TypeError):
            db.session.rollback()
            db.session.flush()
            return response_object, 400


class UserLogin(Resource):
    def post(self):
        post_data = request.get_json()
        response_object = {
            "message": "Invalid payload."
        }
        if not post_data:
            return response_object, 400
        email = post_data.get("email")
        password = post_data.get("password")
        try:
            user = User.query.filter_by(email=email).first()
            if user:
                valid_password = bcrypt.check_password_hash(
                    user.password_hash,
                    password
                )
                if valid_password:
                    redis_client.setex(
                        user.id.__str__(),
                        int(current_app.config["JWT_ACCESS_TOKEN_EXPIRES"]),
                        "inactive"
                    )
                    token = create_access_token(
                        identity=user.id.__str__(),
                        fresh=True
                    )
                    jti = get_jti(token)
                    redis_client.setex(
                        user.id.__str__(),
                        int(current_app.config["JWT_ACCESS_TOKEN_EXPIRES"]),
                        jti
                    )
                    response_object = {
                        "token": token,
                        "id": user.id.__str__()
                    }
                    return response_object, 200
                else:
                    response_object["message"] = "Invalid Credentials."
                    return response_object, 401
            else:
                response_object["message"] = "User does not exist."
                return response_object, 404
        except Exception:
            db.session.rollback()
            db.session.flush()
            response_object["message"] = "Try again."
            return response_object, 500


class UserLogOut(Resource):
    @jwt_required
    def get(self):
        response_object = {
            "message": "Provide a valid auth token."
        }
        current_user = get_raw_jwt()
        if current_user.get("identity"):
            response_object["message"] = "Successfully logged out."
            redis_client.setex(
                current_user.get("identity"),
                int(current_app.config["JWT_ACCESS_TOKEN_EXPIRES"]),
                "inactive"
            )
            return response_object, 200
        return response_object, 401
