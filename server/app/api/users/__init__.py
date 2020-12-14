# server/app/api/users/__init__.py

from flask import Blueprint
from flask_restful import Api
from app.api.users.views import UsersRegister


users_blueprint = Blueprint("users", __name__)
users_api = Api(users_blueprint)


users_api.add_resource(UsersRegister, "/user/register")
