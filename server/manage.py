# server/manage.py


import unittest
import coverage
from flask.cli import FlaskGroup
from app import create_app, db, redis_client
from app.api.users.models import User


COV = coverage.coverage(
    branch=True,
    include='app/*',
    omit=[
        'app/tests/*',
        'app/config.py',
        'app/extensions.py'
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
    db.session.add(User(
        name="mark",
        email="mark@gs-news.dev",
        password="petmalu"
    ))
    db.session.add(User(
        name="gijoe",
        email="joe@gs-admin.com",
        password="hello123"
    ))
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
    sys.exit(result)


if __name__ == "__main__":
    cli()
