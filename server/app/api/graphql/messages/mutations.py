# server/app/api/graphql/messages/mutations.py


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
    response = requests.post(
        url=url,
        json=data,
        headers={
            "content-type": "application/json",
            "Authorization": f"Bearer {token}"
        }
    )
    if response.json():
        payload = response.json()
        if payload.get("message"):
            return payload
        if payload.get("message") and response.status_code != 200:
            info = response.status_code
            info = int(info)
            raise Exception(payload["message"])
