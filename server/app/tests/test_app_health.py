# server/app/tests/test_users.py


import json
import unittest
from app.tests.base import BaseTestCase


class TestAppStatus(BaseTestCase):
    def test_app_status(self):
        """Ensure the /ping route behaves correctly."""
        response = self.client.get("/ping")
        data = json.loads(response.data.decode())
        self.assertEqual(response.status_code, 200)
        self.assertIn("pong!", data["message"])
        self.assertIn("success", data["status"])


if __name__ == "__main__":
    unittest.main()
