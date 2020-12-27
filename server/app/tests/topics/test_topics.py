# server/app/tests/topics/test_topics.py


import json
import time
from flask import current_app
from app.api.rest.users.models import User
from app.tests.base import BaseTestCase
from app.tests.utils import (
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

    def test_create_topic_has_missing_keys(self):
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
            create_topic = self.client.post(
                "/topic",
                data=json.dumps({
                    "description": "User 1 Description"
                }),
                content_type="application/json",
                headers={"Authorization": f"Bearer {token}"}
            )
            create_topic_data = json.loads(
                create_topic.data.decode()
            )
            self.assertEqual(create_topic.status_code, 400)
            self.assertIn(
                "Invalid payload.",
                create_topic_data["message"]
            )

    def test_get_topic(self):
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
            create_topic = self.client.post(
                "/topic",
                data=json.dumps({
                    "subject": "Something",
                    "description": "User 1 Description"
                }),
                content_type="application/json",
                headers={"Authorization": f"Bearer {token}"}
            )
            create_topic_data = json.loads(
                create_topic.data.decode()
            )
            get_topic = self.client.get(
                f"/topic/{create_topic_data['id']}",
                content_type="application/json",
                headers={"Authorization": f"Bearer {token}"}
            )
            get_topic_data = json.loads(
                get_topic.data.decode()
            )
            self.assertEqual(get_topic.status_code, 200)
            self.assertIsInstance(
                get_topic_data["data"],
                dict
            )

    def test_get_topic_not_found(self):
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
            get_topic = self.client.get(
                "/topic/56f58f16-8c87-4855-8fc4-cc1ba7397a18",
                content_type="application/json",
                headers={"Authorization": f"Bearer {token}"}
            )
            get_topic_data = json.loads(
                get_topic.data.decode()
            )
            self.assertEqual(get_topic.status_code, 404)
            self.assertEqual(
                get_topic_data["message"],
                "Topic does not exists."
            )

    def test_get_topic_server_error(self):
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
            get_topic = self.client.get(
                f"/topic/{None}",
                content_type="application/json",
                headers={"Authorization": f"Bearer {token}"}
            )
            get_topic_data = json.loads(
                get_topic.data.decode()
            )
            self.assertEqual(get_topic.status_code, 400)
            self.assertEqual(
                get_topic_data["message"],
                "Invalid ID."
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
            update_topic = self.client.patch(
                "/topic/56f58f16-8c87-4855-8fc4-cc1ba7397a18",
                data=json.dumps(test_update_data),
                content_type="application/json",
                headers={"Authorization": f"Bearer {token}"}
            )
            update_topic_data = json.loads(update_topic.data.decode())
            self.assertEqual(update_topic.status_code, 404)
            self.assertEqual(
                update_topic_data["message"],
                "Topic does not exists."
            )

    def test_update_topic_invalid_id(self):
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
            create_topic = self.client.post(
                "/topic",
                data=json.dumps({"subject": "subject", "description": "desc"}),
                content_type="application/json",
                headers={"Authorization": f"Bearer {token}"}
            )
            create_topic_data = json.loads(
                create_topic.data.decode()
            )
            test_update_data = {
                "subjectxsz": "Updated subject",
                "description": "Updated description"
            }
            update_topic = self.client.patch(
                f"/topic/{None}",
                data=json.dumps(test_update_data),
                content_type="application/json",
                headers={"Authorization": f"Bearer {token}"}
            )
            update_topic_data = json.loads(update_topic.data.decode())
            self.assertEqual(update_topic.status_code, 400)
            self.assertEqual(
                update_topic_data["message"],
                "Invalid payload."
            )

    def test_update_topic_invalid_json_keys(self):
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
            create_topic = self.client.post(
                "/topic",
                data=json.dumps({"subject": "subject", "description": "desc"}),
                content_type="application/json",
                headers={"Authorization": f"Bearer {token}"}
            )
            create_topic_data = json.loads(
                create_topic.data.decode()
            )
            test_update_data = {
                "subjectxsz": "Updated subject",
                "description": "Updated description"
            }
            update_topic = self.client.patch(
                f"/topic/{create_topic_data['id']}",
                data=json.dumps(test_update_data),
                content_type="application/json",
                headers={"Authorization": f"Bearer {token}"}
            )
            update_topic_data = json.loads(update_topic.data.decode())
            self.assertEqual(update_topic.status_code, 400)
            self.assertEqual(
                update_topic_data["message"],
                "Invalid payload."
            )

    def test_update_topic_invalid_payload(self):
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
            create_topic = self.client.post(
                "/topic",
                data=json.dumps({"subject": "subject", "description": "desc"}),
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
            update_topic = self.client.patch(
                f"/topic/{create_topic_data['id']}",
                data=json.dumps({}),
                content_type="application/json",
                headers={"Authorization": f"Bearer {token}"}
            )
            update_topic_data = json.loads(update_topic.data.decode())
            self.assertEqual(update_topic.status_code, 400)
            self.assertEqual(
                update_topic_data["message"],
                "Invalid payload."
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
                    "description": "User 1 Description"
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
            update_topic = self.client.patch(
                f"/topic/{topic_id}",
                data=json.dumps(test_update_data),
                content_type="application/json",
                headers={"Authorization": f"Bearer {token_2}"}
            )
            update_topic_data = json.loads(update_topic.data.decode())
            self.assertEqual(update_topic.status_code, 401)
            self.assertEqual(
                update_topic_data["message"],
                "You do not have permission to do that."
            )

    def test_delete_topic(self):
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
            create_topic = self.client.post(
                "/topic",
                data=json.dumps({"subject": "subject", "description": "desc"}),
                content_type="application/json",
                headers={"Authorization": f"Bearer {token}"}
            )
            create_topic_data = json.loads(
                create_topic.data.decode()
            )
            delete_topic = self.client.delete(
                f"/topic/{create_topic_data['id']}",
                content_type="application/json",
                headers={"Authorization": f"Bearer {token}"}
            )
            delete_topic_data = json.loads(delete_topic.data.decode())
            self.assertEqual(delete_topic.status_code, 202)
            self.assertTrue(delete_topic_data["success"])

    def test_delete_topic_not_exists(self):
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
            delete_topic = self.client.delete(
                "/topic/56f58f16-8c87-4855-8fc4-cc1ba7397a18",
                content_type="application/json",
                headers={"Authorization": f"Bearer {token}"}
            )
            delete_topic_data = json.loads(delete_topic.data.decode())
            self.assertEqual(delete_topic.status_code, 404)
            self.assertEqual(
                delete_topic_data["message"], "Topic does not exists."
            )

    def test_delete_topic_not_owned(self):
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
                    "description": "User 1 Description"
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
            delete_topic = self.client.delete(
                f"/topic/{topic_id}",
                content_type="application/json",
                headers={"Authorization": f"Bearer {token_2}"}
            )
            delete_topic_data = json.loads(delete_topic.data.decode())
            self.assertEqual(delete_topic.status_code, 401)
            self.assertEqual(
                delete_topic_data["message"],
                "You do not have permission to do that."
            )

    def test_delete_topic_invalid_id(self):
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
            create_topic = self.client.post(
                "/topic",
                data=json.dumps({"subject": "subject", "description": "desc"}),
                content_type="application/json",
                headers={"Authorization": f"Bearer {token}"}
            )
            create_topic_data = json.loads(
                create_topic.data.decode()
            )
            delete_topic = self.client.delete(
                f"/topic/{None}",
                content_type="application/json",
                headers={"Authorization": f"Bearer {token}"}
            )
            delete_topic_data = json.loads(delete_topic.data.decode())
            self.assertEqual(delete_topic.status_code, 400)
            self.assertEqual("Invalid payload.", delete_topic_data["message"])

    def test_get_all_topics(self):
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
            current_app.config['PAGE_COUNT'] = None
            get_topics = self.client.get(
                f"/topics",
                data=json.dumps({"page": 1}),
                content_type="application/json",
                headers={"Authorization": f"Bearer {token}"}
            )
            get_topics_data = json.loads(get_topics.data.decode())
            self.assertEqual(get_topics.status_code, 200)
            self.assertIsInstance(get_topics_data["data"], list)

    def test_get_all_topics_invalid_payload(self):
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
            current_app.config['PAGE_COUNT'] = None
            get_topics = self.client.get(
                f"/topics",
                data=json.dumps({"page": None}),
                content_type="application/json",
                headers={"Authorization": f"Bearer {token}"}
            )
            get_topics_data = json.loads(get_topics.data.decode())
            self.assertEqual(get_topics.status_code, 400)
            self.assertEqual(get_topics_data["message"], "Invalid payload.")

    def test_get_all_topics_empty_payload(self):
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
            get_topics = self.client.get(
                f"/topics",
                data=json.dumps({}),
                content_type="application/json",
                headers={"Authorization": f"Bearer {token}"}
            )
            get_topics_data = json.loads(get_topics.data.decode())
            self.assertEqual(get_topics.status_code, 400)
            self.assertEqual(get_topics_data["message"], "Invalid payload.")
