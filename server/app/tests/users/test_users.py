# server/app/tests/users/test_users.py


import json
import time
from flask import current_app
from flask_jwt_extended import get_jti
from app.api.users.models import User
from app.tests.base import BaseTestCase
from app.utils import (
    iso8601_pattern_matched,
    uuid_pattern_matched
)


class TestUserView(BaseTestCase):
    def test_register_user(self):
        """Ensure that a user can be added to the database."""
        data_test = {
            "email": "email@address.com",
            "name": "Name",
            "password": "password"
        }
        with self.client:
            response = self.client.post(
                "/user/register",
                data=json.dumps(data_test),
                content_type="application/json"
            )
            data = json.loads(response.data)
            self.assertEqual(response.status_code, 201)
            self.assertTrue(uuid_pattern_matched(data["id"]))
            self.assertEqual(data_test["name"], data["name"])
            self.assertEqual(data_test["email"], data["email"])
            self.assertNotIn("password", data)
            self.assertTrue(iso8601_pattern_matched(data["created_at"]))
            self.assertTrue(iso8601_pattern_matched(data["updated_at"]))

    def test_add_user_invalid_json(self):
        """Ensure error is thrown if the JSON object is empty."""
        data_test = {}
        with self.client:
            response = self.client.post(
                "/user/register",
                data=json.dumps(data_test),
                content_type="application/json"
            )
            data = json.loads(response.data)
            self.assertEqual(response.status_code, 400)
            self.assertIn("Invalid payload.", data["message"])

    def test_add_user_invalid_json_keys(self):
        """
        Ensure error is thrown if the JSON object keys provided is incomplete.
        """
        data_test_email_only = {"email": "sample@samp.le"}
        data_test_password_only = {"password": "password"}
        data_test_name_only = {"name": "lmao"}
        with self.client:
            response_email_only = self.client.post(
                "/user/register",
                data=json.dumps(data_test_email_only),
                content_type="application/json"
            )
            data_email_only = json.loads(response_email_only.data)
            response_password_only = self.client.post(
                "/user/register",
                data=json.dumps(data_test_password_only),
                content_type="application/json"
            )
            data_password_only = json.loads(response_password_only.data)
            response_name_only = self.client.post(
                "/user/register",
                data=json.dumps(data_test_name_only),
                content_type="application/json"
            )
            data_name_only = json.loads(response_name_only.data)
            self.assertEqual(response_email_only.status_code, 400)
            self.assertEqual(response_password_only.status_code, 400)
            self.assertEqual(response_name_only.status_code, 400)
            self.assertIn("Invalid payload.", data_email_only["message"])
            self.assertIn("Invalid payload.", data_name_only["message"])
            self.assertIn("Invalid payload.", data_password_only["message"])

    def test_register_user_duplicate_email(self):
        """Ensure error is thrown if the email already exists."""
        data_test = {
            "name": "juan",
            "email": "michael@abc.org",
            "password": "samplepassword",
        }
        with self.client:
            self.client.post(
                "/user/register",
                data=json.dumps(data_test),
                content_type="application/json"
            )
            response = self.client.post(
                "/user/register",
                data=json.dumps(data_test),
                content_type="application/json"
            )
            data = json.loads(response.data)
            self.assertEqual(response.status_code, 400)
            self.assertIn(
                "Sorry. That email already exists.",
                data["message"]
            )

    def test_registered_user_login(self):
        """Ensure that a registered user can login."""
        data_test = {
            "name": "juan",
            "email": "michael@abc.org",
            "password": "samplepassword",
        }
        user = User(**data_test)
        user.insert()
        with self.client:
            response = self.client.post(
                "/user/login",
                data=json.dumps(data_test),
                content_type="application/json"
            )
            data = json.loads(response.data)
            self.assertTrue(data["token"])
            self.assertTrue(response.content_type == "application/json")
            self.assertEqual(response.status_code, 200)

    def test_not_registered_user_login(self):
        """Ensure that a non-registered user cannot login."""
        data_test = {
            "email": "michael@abc.org",
            "password": "samplepassword",
        }
        with self.client:
            response = self.client.post(
                "/user/login",
                data=json.dumps(data_test),
                content_type="application/json"
            )
            data = json.loads(response.data)
            self.assertTrue(data["message"] == "User does not exist.")
            self.assertTrue(response.content_type == "application/json")
            self.assertEqual(response.status_code, 404)

    def test_not_allowed_more_than_one_concurrent_user(self):
        """Ensure that only one token per user is valid.

        First user logs in using account X: Gets a valid token A.
        Second user logs in using account X: Gets a valid token B.
        token A becomes invalid.
        """
        data_test = {
            "name": "juan",
            "email": "michael@abc.org",
            "password": "samplepassword",
        }
        user = User(**data_test)
        user.insert()
        with self.client:
            first_login = self.client.post(
                "/user/login",
                data=json.dumps({
                    "email": data_test["email"],
                    "password": data_test["password"]
                }),
                content_type="application/json"
            )
            second_login = self.client.post(
                "/user/login",
                data=json.dumps({
                    "email": data_test["email"],
                    "password": data_test["password"]
                }),
                content_type="application/json"
            )
            data1 = json.loads(first_login.data.decode())
            data2 = json.loads(second_login.data.decode())
            token1 = data1.get("token")
            token2 = data2.get("token")
            # TODO: Change the route to /topic once implemented.
            logout1 = self.client.get(
                "/user/logout",
                headers={"Authorization": f"Bearer {token1}"}
            )
            logout2 = self.client.get(
                "/user/logout",
                headers={"Authorization": f"Bearer {token2}"}
            )
            data1 = json.loads(logout1.data.decode())
            data2 = json.loads(logout2.data.decode())
            self.assertTrue(logout1.status_code == 401)
            self.assertEqual(
                data1["message"],
                "Invalid token. Please log in again."
            )
            self.assertTrue(logout2.status_code == 200)
            self.assertEqual(
                data2["message"],
                "Successfully logged out."
            )

    def test_jwt_is_invalid(self):
        """Ensure that the token provided is in the correct format."""
        data_test = {
            "name": "juan",
            "email": "michael@abc.org",
            "password": "samplepassword",
        }
        user = User(**data_test)
        user.insert()
        with self.client:
            response = self.client.post(
                "/user/login",
                data=json.dumps({
                    "email": data_test["email"],
                    "password": data_test["password"]
                }),
                content_type="application/json"
            )
            data = json.loads(response.data)
            token = data.get("token")
            with self.assertRaises(Exception) as context:
                get_jti(token + "something-invalid")
            self.assertIn(
                "Signature verification failed", str(context.exception)
            )

    def test_valid_logout(self):
        """Ensure that a logged in user can log out."""
        data_test = {
            "name": "james",
            "email": "michael@abc.org",
            "password": "samplepassword",
        }
        user = User(**data_test)
        user.insert()
        with self.client:
            resp_login = self.client.post(
                "/user/login",
                data=json.dumps({
                    "email": data_test["email"],
                    "password": data_test["password"]
                }),
                content_type="application/json"
            )
            token = json.loads(resp_login.data)["token"]
            response = self.client.get(
                "/user/logout",
                headers={"Authorization": f"Bearer {token}"}
            )
            data = json.loads(response.data.decode())
            self.assertTrue(data["message"] == "Successfully logged out.")
            self.assertEqual(response.status_code, 200)

    def test_invalid_logout_expired_token(self):
        """Ensure that a user with expired token cannot log out."""
        data_test = {
            "name": "james",
            "email": "michael@abcde.org",
            "password": "samplepassword",
        }
        user = User(**data_test)
        user.insert()
        current_app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 1
        with self.client:
            resp_login = self.client.post(
                "/user/login",
                data=json.dumps({
                    "email": data_test["email"],
                    "password": data_test["password"]
                }),
                content_type="application/json"
            )
            token = json.loads(resp_login.data.decode()).get("token")
            time.sleep(3)
            response = self.client.get(
                "/user/logout",
                headers={"Authorization": f"Bearer {token}"}
            )
            data = json.loads(response.data)
            self.assertTrue(
                data["message"] == "Signature expired. Please log in again."
            )
            self.assertEqual(response.status_code, 401)

    def test_invalid_logout(self):
        """Ensure that the token provided before logging out is valid."""
        with self.client:
            response = self.client.get(
                "/user/logout",
                headers={"Authorization": "Bearer invalid"})
            data = json.loads(response.data)
            self.assertTrue(
                data["message"] == "Invalid token. Please log in again.")
            self.assertEqual(response.status_code, 401)
