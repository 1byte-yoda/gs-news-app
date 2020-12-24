# server/app/api/messages/graphql_queries.py


import requests
from ariadne import convert_kwargs_to_snake_case
from flask import url_for


@convert_kwargs_to_snake_case
def resolve_messages(obj, info, token, page, topic_id):
    payload = requests.get(
        url=url_for(
            "messages.multiplemessageviews",
            topic_id=topic_id,
            _external=True
        ),
        json={"page": page},
        headers={
            "content-type": "application/json",
            "Authorization": f"Bearer {token}"
        }
    )
    if payload.json():
        payload = payload.json()
        print(payload)
        return payload
    raise Exception(payload.get("message"))
