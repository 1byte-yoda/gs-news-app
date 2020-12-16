# server/app/tests/topics/test_topic_model.py


from app.tests.base import BaseTestCase
from app.api.topics.models import Topic
from app.api.users.models import User
from app.utils import uuid_pattern_matched, iso8601_pattern_matched


class TestUserModel(BaseTestCase):
    def test_create_topic(self):
        user = User(
            name="testname",
            email="testme@test.com",
            password="twentyonepilots"
        )
        user.insert()
        topic = Topic(
            subject="subject",
            description="description",
            created_by=user.id.__str__(),
            updated_by=user.id.__str__()
        )
        topic.insert()
        self.assertTrue(uuid_pattern_matched(topic.id.__str__()))
        self.assertEqual(topic.subject, 'subject')
        self.assertEqual(topic.description, 'description')
        self.assertTrue(topic.created_by)
        self.assertTrue(
            uuid_pattern_matched(topic.created_by.__str__())
        )
        self.assertTrue(topic.updated_by)
        self.assertTrue(
            uuid_pattern_matched(topic.updated_by.__str__())
        )
        self.assertTrue(topic.created_at)
        self.assertTrue(iso8601_pattern_matched(topic.created_at))
        self.assertTrue(topic.updated_at)
        self.assertTrue(iso8601_pattern_matched(topic.updated_at))

    def test_topic_json(self):
        user = User(
            name="testname",
            email="testme@test.com",
            password="twentyonepilots"
        )
        user.insert()
        topic = Topic(
            subject="subject",
            description="description",
            created_by=user.id.__str__(),
            updated_by=user.id.__str__()
        )
        topic.insert()
        self.assertTrue(isinstance(topic.json(), dict))
