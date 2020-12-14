# server/app/tests/users/test_users_model.py


import json
from app.tests.base import BaseTestCase
from app.api.users.models import User


class TestUserModel(BaseTestCase):
    def test_passwords_are_random(self):
        user_one = User(
            name="justatest",
             email="test@test.com",
             password="twentyonepilots"
        )
        user_two = User(
            name="justatest2",
            email="test@test2.com",
            password="twentyonepilots"
        )
        self.assertNotEqual(user_one.password_hash, user_two.password_hash)

    def test_password_attribute_is_protected(self):
        user = User(
            name="justatest",
             email="test@test.com",
             password="twentyonepilots"
        )
        with self.assertRaises(Exception) as context:
            user.password
        self.assertIn("password is not a readable attribute", str(context.exception))
