# server/db/__init__.py


from flask_sqlalchemy import SQLAlchemy
# server/app/api/utils.py


from datetime import datetime
from typing import Union
from sqlalchemy.types import (
    TypeDecorator,
    DateTime
)


db = SQLAlchemy()


class ISO8601DateTime(TypeDecorator):
    """
    Class decorator to implement DateTime data type in ISO 8601 format.
    """
    impl = DateTime

    def process_bind_param(self, value, dialect) -> Union[None, datetime]:
        if not value:
            return None
        if isinstance(value, datetime):
            return value.replace(microsecond=0)
        return value

    def process_result_value(self, value, dialect) -> Union[None, str]:
        if value is None:
            return None
        return value.astimezone().replace(microsecond=0).isoformat()
