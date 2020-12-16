# server/app/tests/topics/test_topics.py


import json
from app.api.users.models import User
from app.tests.base import BaseTestCase
from app.utils import (
    iso8601_pattern_matched,
    uuid_pattern_matched
)


class TestTopicView(BaseTestCase):
    def test_create_topic_loggedin_user(self):
        """
        Ensure that a logged in user can create a topic to the database.
        """
        user_test = {
            "email": "email@address.com",
            "name": "Name",
            "password": "password"
        }
        data_test = {
            "subject": "Topic 1",
            "description": "This is the description for Topic 1"
        }
        user = User(**user_test)
        user.insert()
        with self.client:
            login = self.client.post(
                "/user/login",
                data=json.dumps({
                    "email": user.email,
                    "password": "password"
                }),
                content_type="application/json",
            )
            login_data = json.loads(login.data.decode())
            token = login_data.get("token")
            create_topic = self.client.post(
                "/topic",
                data=json.dumps(data_test),
                content_type="application/json",
                headers={"Authorization": f"Bearer {token}"}
            )

            create_topic_data = json.loads(create_topic.data)
            self.assertEqual(create_topic.status_code, 201)
            self.assertTrue(uuid_pattern_matched(create_topic_data["id"]))
            self.assertEqual(
                data_test["subject"],
                create_topic_data["subject"]
            )
            self.assertEqual(
                data_test["description"],
                create_topic_data["description"]
            )
            self.assertTrue(
                uuid_pattern_matched(create_topic_data["created_by"])
            )
            self.assertTrue(
                uuid_pattern_matched(create_topic_data["updated_by"])
            )
            self.assertTrue(
                iso8601_pattern_matched(create_topic_data["created_at"])
            )
            self.assertTrue(
                iso8601_pattern_matched(create_topic_data["updated_at"])
            )

    def test_create_topic_invalid_json(self):
        """Ensure error is thrown if the JSON object is empty."""
        user_test = {
            "email": "email@address.com",
            "name": "Name",
            "password": "password"
        }
        data_test = {}
        user = User(**user_test)
        user.insert()
        with self.client:
            login = self.client.post(
                "/user/login",
                data=json.dumps({
                    "email": user.email,
                    "password": "password"
                }),
                content_type="application/json",
            )
            login_data = json.loads(login.data.decode())
            token = login_data.get("token")
            create_topic = self.client.post(
                "/topic",
                data=json.dumps(data_test),
                content_type="application/json",
                headers={"Authorization": f"Bearer {token}"}
            )
            create_topic_data = json.loads(create_topic.data)
            self.assertEqual(create_topic.status_code, 400)
            self.assertIn("Invalid payload.", create_topic_data["message"])

    def test_create_topic_invalid_json_keys(self):
        """
        Ensure error is thrown if the JSON keys are invalid.
        """
        user_test = {
            "email": "email@address.com",
            "name": "Name",
            "password": "password"
        }
        user = User(**user_test)
        user.insert()
        with self.client:
            login = self.client.post(
                "/user/login",
                data=json.dumps({
                    "email": user.email,
                    "password": "password"
                }),
                content_type="application/json",
            )
            login_data = json.loads(login.data.decode())
            token = login_data.get("token")
            one_key_valid = self.client.post(
                "/topic",
                data=json.dumps({
                    "subject": "",
                    "invalid_key": ""
                }),
                content_type="application/json",
                headers={"Authorization": f"Bearer {token}"}
            )
            description_only = self.client.post(
                "/topic",
                data=json.dumps({"description": ""}),
                content_type="application/json",
                headers={"Authorization": f"Bearer {token}"}
            )
            one_key_valid_data = json.loads(one_key_valid.data)
            description_only_data = json.loads(description_only.data)
            self.assertEqual(one_key_valid.status_code, 400)
            self.assertEqual(description_only.status_code, 400)
            self.assertIn("Invalid payload.", one_key_valid_data["message"])
            self.assertIn("Invalid payload.", description_only_data["message"])
