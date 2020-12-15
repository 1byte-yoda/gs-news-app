# server/app/utils.py


import re


def uuid_pattern_matched(uuid_str: str) -> bool:
    """Check if a string is in UUID format.

    Sample match:
        56f58f16-8c87-4855-8fc4-cc1ba7397a18
    """
    uuid_pattern = re.compile(
        r'^[\da-f]{8}-([\da-f]{4}-){3}[\da-f]{12}$',
        re.IGNORECASE
    )
    return uuid_pattern.match(uuid_str)


def iso8601_pattern_matched(datetime_str: str) -> bool:
    """Check if a string is in ISO 8601 format.

    Sample match:
        2020-12-14T08:41:39+00:00
    """
    iso8601_pattern = re.compile(
        r'^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$'
    )
    return iso8601_pattern.match(datetime_str)
