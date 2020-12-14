# server/app/tests/users/test_user_model.py


from sqlalchemy.exc import IntegrityError
from app.tests.base import BaseTestCase
from app.api.users.models import User
from app.tests.utils import uuid_pattern_matched, iso8601_pattern_matched
from app import db


class TestUserModel(BaseTestCase):
    def test_add_user(self):
        user = User(
            name="testname",
            email="testme@test.com",
            password="twentyonepilots"
        )
        user.insert()
        self.assertTrue(user.id)
        self.assertTrue(uuid_pattern_matched(user.id.__str__()))
        self.assertEqual(user.name, 'testname')
        self.assertEqual(user.email, 'testme@test.com')
        self.assertTrue(user.created_at)
        self.assertTrue(iso8601_pattern_matched(user.created_at))
        self.assertTrue(user.updated_at)
        self.assertTrue(iso8601_pattern_matched(user.updated_at))

    def test_add_user_duplicate_email(self):
        user = User(
            name="testname",
            email="testme@test.com",
            password="twentyonepilots"
        )
        user.insert()
        duplicate_user = User(
            name="testname",
            email="testme@test.com",
            password="twentyonepilots"
        )
        db.session.add(duplicate_user)
        self.assertRaises(IntegrityError, db.session.commit)

    def test_user_json(self):
        user = User(
            name="testname",
            email="testme@test.com",
            password="twentyonepilots"
        )
        user.insert()
        self.assertTrue(isinstance(user.json(), dict))

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
        self.assertIn(
            "password is not a readable attribute", str(context.exception)
        )
