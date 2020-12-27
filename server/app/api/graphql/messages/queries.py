# server/app/api/graphql/messages/queries.py


import requests
from ariadne import convert_kwargs_to_snake_case
from flask import url_for


@convert_kwargs_to_snake_case
def resolve_messages(obj, info, token, page, topic_id):
    response = requests.get(
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
    if response.json():
        payload = response.json()
        return payload
    if response.status_code != 200:
        info = response.status_code
        info = int(info)
        raise Exception(response.json().get("message"))
