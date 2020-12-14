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
            self.assertTrue(uuid_pattern_matched(data.get("id")))
            self.assertEqual(data_test.get("name"), data.get("name"))
            self.assertEqual(data_test.get("email"), data.get("email"))
            self.assertNotIn("password", data)
            self.assertTrue(iso8601_pattern_matched(data.get("created_at")))
            self.assertTrue(iso8601_pattern_matched(data.get("updated_at")))
