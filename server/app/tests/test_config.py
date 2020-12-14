# server/app/tests/test_config.py


import os
import unittest
from flask import current_app
from flask_testing import TestCase
from app import create_app


app = create_app()


class TestDevelopmentConfig(TestCase):
    def create_app(self):
        app_settings = os.environ.get("APP_SETTINGS")
        app.config.from_object(app_settings)
        return app

    def test_app_is_development(self):
        secret_key = os.environ.get("SECRET_KEY")
        db_url = os.environ.get("DATABASE_URL")
        bcrypt_rounds_dev = int(os.environ.get("BCRYPT_LOG_ROUNDS_DEV"))
        self.assertTrue(app.config["SECRET_KEY"] == secret_key)
        self.assertFalse(current_app is None)
        self.assertTrue(
            app.config["SQLALCHEMY_DATABASE_URI"] == db_url
        )
        self.assertTrue(
            app.config['BCRYPT_LOG_ROUNDS'] == bcrypt_rounds_dev
        )
        self.assertTrue(app.config['TOKEN_EXPIRATION_DAYS'] == 30)
        self.assertTrue(app.config['TOKEN_EXPIRATION_SECONDS'] == 0)


class TestTestingConfig(TestCase):
    def create_app(self):
        app.config.from_object("app.config.TestingConfig")
        return app

    def test_app_is_testing(self):
        secret_key = os.environ.get("SECRET_KEY")
        db_test_url = os.environ.get("DATABASE_TEST_URL")
        bcrypt_rounds_test = int(os.environ.get("BCRYPT_LOG_ROUNDS_TEST"))
        self.assertTrue(app.config["SECRET_KEY"] == secret_key)
        self.assertTrue(app.config["TESTING"])
        self.assertFalse(app.config["PRESERVE_CONTEXT_ON_EXCEPTION"])
        self.assertTrue(
            app.config["SQLALCHEMY_DATABASE_URI"] == db_test_url
        )
        self.assertTrue(
            app.config['BCRYPT_LOG_ROUNDS'] == bcrypt_rounds_test
        )
        self.assertTrue(app.config['TOKEN_EXPIRATION_DAYS'] == 0)
        self.assertTrue(app.config['TOKEN_EXPIRATION_SECONDS'] == 3)

class TestProductionConfig(TestCase):
    def create_app(self):
        app.config.from_object("app.config.ProductionConfig")
        return app

    def test_app_is_production(self):
        secret_key = os.environ.get("SECRET_KEY")
        bcrypt_rounds = int(os.environ.get("BCRYPT_LOG_ROUNDS"))
        self.assertTrue(app.config["SECRET_KEY"] == secret_key)
        self.assertFalse(app.config["TESTING"])
        self.assertTrue(
            app.config['BCRYPT_LOG_ROUNDS'] == bcrypt_rounds
        )
        self.assertTrue(app.config['TOKEN_EXPIRATION_DAYS'] == 30)
        self.assertTrue(app.config['TOKEN_EXPIRATION_SECONDS'] == 0)


if __name__ == "__main__":
    unittest.main()
