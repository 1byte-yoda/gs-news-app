# server/app/tests/topics/test_topics.py


import json
import time
from app.api.rest.users.models import User
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
            self.assertIsInstance(
                create_topic_data["created_by"], dict
            )
            self.assertTrue(
                create_topic_data["updated_by"], dict
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
            self.assertIn(
                "Invalid payload.",
                create_topic_data["message"]
            )

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
            self.assertIn(
                "Invalid payload.",
                one_key_valid_data["message"]
            )
            self.assertIn(
                "Invalid payload.",
                description_only_data["message"]
            )

    def test_update_topic_loggedin_user(self):
        """
        Ensure that a logged in user can update a topic to the database.
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
            create_topic_data = json.loads(
                create_topic.data.decode()
            )
            test_update_data = {
                "subject": "Updated subject",
                "description": "Updated description"
            }
            topic_id = create_topic_data["id"]
            time.sleep(1.5)
            update_topic = self.client.patch(
                f"/topic/{topic_id}",
                data=json.dumps(test_update_data),
                content_type="application/json",
                headers={"Authorization": f"Bearer {token}"}
            )
            update_topic_data = json.loads(update_topic.data.decode())
            self.assertEqual(update_topic.status_code, 200)
            self.assertNotEqual(
                update_topic_data["subject"],
                create_topic_data["subject"]
            )
            self.assertNotEqual(
                update_topic_data["description"],
                create_topic_data["description"]
            )
            self.assertEqual(
                update_topic_data["subject"],
                test_update_data["subject"]
            )
            self.assertEqual(
                update_topic_data["description"],
                test_update_data.get("description")
            )
            self.assertEqual(
                create_topic_data["created_by"],
                update_topic_data["created_by"]
            )
            self.assertEqual(
                create_topic_data["updated_by"],
                update_topic_data["updated_by"]
            )
            self.assertEqual(
                create_topic_data["created_at"],
                update_topic_data["created_at"]
            )
            self.assertLess(
                create_topic_data["updated_at"],
                update_topic_data["updated_at"]
            )

        def test_update_topic_not_exist(self):
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
                test_update_data = {
                    "subject": "Updated subject",
                    "description": "Updated description"
                }
                update_topic = self.client.post(
                    "/topic/some-unknown-uuid",
                    json=json.dumps(test_update_data),
                    content_type="application/json",
                    headers={"Authorization": f"Bearer {token}"}
                )
                update_topic_data = json.loads(update_topic.data.decode())
                self.assertEqual(update_topic.status_code, 404)
                self.assertEqual(
                    update_topic_data["message"],
                    "Topic does not exists."
                )

        def test_update_topic_not_owned(self):
            user_test1 = {
                "email": "email@address.com",
                "name": "Name",
                "password": "password"
            }
            user_test2 = {
                "email": "email2@address22.com",
                "name": "Name2",
                "password": "password"
            }
            user1 = User(**user_test1)
            user2 = User(**user_test2)
            user1.insert()
            user2.insert()
            with self.client:
                login = self.client.post(
                    "/user/login",
                    data=json.dumps({
                        "email": user1.email,
                        "password": "password"
                    }),
                    content_type="application/json",
                )
                login_data = json.loads(login.data.decode())
                token = login_data.get("token")
                create_topic = self.client.post(
                    "/topic",
                    data=json.dumps({
                        "subject": "User 1 Subject",
                        "description": "User 2 Subject"
                    }),
                    content_type="application/json",
                    headers={"Authorization": f"Bearer {token}"}
                )
                create_topic_data = json.loads(
                    create_topic.data.decode()
                )
                topic_id = create_topic_data["id"]
                login2 = self.client.post(
                    "/user/login",
                    data=json.dumps({
                        "email": user2.email,
                        "password": "password"
                    }),
                    content_type="application/json",
                )
                login_data2 = json.loads(login2.data.decode())
                token_2 = login_data2.get("token")
                test_update_data = {
                    "subject": "Updated subject",
                    "description": "Updated description"
                }
                update_topic = self.client.post(
                    f"/topic/{topic_id}",
                    json=json.dumps(test_update_data),
                    content_type="application/json",
                    headers={"Authorization": f"Bearer {token_2}"}
                )
                update_topic_data = json.loads(update_topic.data.decode())
                self.assertEqual(update_topic.status_code, 401)
                self.assertEqual(
                    update_topic_data["message"],
                    "You do not have permission to do that."
                )
