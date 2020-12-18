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
    payload = requests.post(
        url=url,
        json=data,
        headers={
            "content-type": "application/json",
            "Authorization": f"Bearer {token}"
        }
    )
    if payload.json():
        payload = payload.json()
        if payload.get("data"):
            payload = payload.get("data")
    return payload
