# server/manage.py


import unittest
import coverage
from flask.cli import FlaskGroup
from app import create_app, db, redis_client


COV = coverage.coverage(
    branch=True,
    include=['app/*'],
    omit=[
        'app/tests/*',
        'app/config.py',
        'app/__init__.py',
    ]
)
COV.start()


app = create_app()
cli = FlaskGroup(create_app=create_app)


@cli.command("recreate_db")
def recreate_db():
    db.drop_all()
    db.create_all()
    db.session.commit()
    redis_client.flushdb()


@cli.command("seed_db")
def seed_db():
    """Seeds the database."""
    import string
    import json
    from app.api.rest.users.models import User
    from app.api.rest.topics.models import Topic
    from app.api.rest.messages.models import Message
    user1 = User(
        name="mark",
        email="mark@gs-news.dev",
        password="petmalu"
    )
    user2 = User(
        name="juan",
        email="sample_mail@gmail.com",
        password="password123"
    )
    user1.insert()
    user2.insert()
    seed_data = json.load(open("seed.json"))
    alphabet = list(string.ascii_lowercase)
    alphabet.reverse()
    for i in alphabet:
        topic = Topic(
            subject=f"{i} This is a sample Subject",
            description=seed_data.get("lorem"),
            created_by=user2.id.__str__(),
            updated_by=user2.id.__str__()
        )
        db.session.add(topic)
    for i in range(1, 30):
        topic.messages.append(
            Message(
                message=f"Sample Comment {i}",
                created_by=user2.id.__str__(),
                updated_by=user2.id.__str__()
            )
        )
    for i in range(1, 30):
        topic.messages.append(
            Message(
                message=f"Sample Comment {i}",
                created_by=user1.id.__str__(),
                updated_by=user1.id.__str__()
            )
        )
    db.session.commit()


@cli.command("test")
def test():
    """Runs the tests without code coverage"""
    tests = unittest.TestLoader().discover("app/tests", pattern="test*.py")
    result = unittest.TextTestRunner(verbosity=2).run(tests)
    if result.wasSuccessful():
        return 0
    return 1


@cli.command()
def cov():
    """Runs the unit tests with coverage."""
    tests = unittest.TestLoader().discover('app/tests')
    result = unittest.TextTestRunner(verbosity=2).run(tests)
    if result.wasSuccessful():
        COV.stop()
        COV.save()
        print('Coverage Summary:')
        COV.report()
        COV.html_report()
        COV.erase()
        return 0
    import sys
    sys.exit(result)


if __name__ == "__main__":
    cli()
