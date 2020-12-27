# server/app/api/rest/users/__init__.py

from flask import Blueprint
from flask_restful import Api
from app.api.rest.users.views import (
    UserRegister,
    UserLogin,
    UserLogOut,
    SingleUserViews
)


users_blueprint = Blueprint("users", __name__)
users_api = Api(users_blueprint)


users_api.add_resource(UserRegister, "/user/register")
users_api.add_resource(UserLogin, "/user/login")
users_api.add_resource(UserLogOut, "/user/logout")
users_api.add_resource(SingleUserViews, "/user/<string:id>")
