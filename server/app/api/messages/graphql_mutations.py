# server/app/api/messages/graphql_mutations.py


from ariadne import convert_kwargs_to_snake_case
from flask import url_for
import requests


@convert_kwargs_to_snake_case
def resolve_message_create(obj, info, token, topic_id, message):
    data = {
        "message": message
    }
    url = url_for(
        "messages.singlemessageviews",
        topic_id=topic_id,
        _external=True
    )
    res = requests.post(
        url=url,
        json=data,
        headers={
            "content-type": "application/json",
            "Authorization": f"Bearer {token}"
        }
    )
    if res.status_code != 200:
        payload = res.json()
        raise Exception(payload.get("message"))
    if res.json():
        payload = res.json()
        if payload.get("data"):
            payload = payload.get("data")
    return payload
