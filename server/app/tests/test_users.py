# server/app/tests/test_users.py


import json
from app.tests.base import BaseTestCase
from app.tests.utils import iso8601_pattern_matched, uuid_pattern_matched


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
            self.assertIn('Invalid payload.', data['message'])

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
            response_password_only = self.client.post(
                "/user/register",
                data=json.dumps(data_test_password_only),
                content_type="application/json"
            )
            response_name_only = self.client.post(
                "/user/register",
                data=json.dumps(data_test_name_only),
                content_type="application/json"
            )
            data_email_only = json.loads(response_email_only.data)
            data_password_only = json.loads(response_password_only.data)
            data_name_only = json.loads(response_name_only.data)
            self.assertEqual(response_email_only.status_code, 400)
            self.assertIn('Invalid payload.', data_email_only['message'])
            self.assertEqual(response_name_only.status_code, 400)
            self.assertIn('Invalid payload.', data_name_only['message'])
            self.assertEqual(response_password_only.status_code, 400)
            self.assertIn('Invalid payload.', data_password_only['message'])


    def test_add_user_duplicate_email(self):
        """Ensure error is thrown if the email already exists."""
        data_test = {
            'name': 'juan',
            'email': 'michael@abc.org',
            'password': 'samplepassword',
        }
        with self.client:
            self.client.post(
                '/user/register',
                data=json.dumps(data_test),
                content_type='application/json'
            )
            response = self.client.post(
                '/user/register',
                data=json.dumps(data_test),
                content_type='application/json'
            )
            data = json.loads(response.data)
            self.assertEqual(response.status_code, 400)
            self.assertIn(
                'Sorry. That email already exists.',
                data['message']
            )
