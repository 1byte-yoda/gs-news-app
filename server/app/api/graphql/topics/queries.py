# server/app/api/graphql/topics/queries.py


import requests
from ariadne import convert_kwargs_to_snake_case
from flask import url_for


@convert_kwargs_to_snake_case
def resolve_topic(obj, info, token, id):
    url = url_for("topics.singletopicviews", id=id, _external=True)
    response = requests.get(
        url=url,
        headers={
            "content-type": "application/json",
            "Authorization": f"Bearer {token}"
        }
    )
    if response.json():
        payload = response.json()
        if payload.get("data"):
            payload = payload.get("data")
        elif payload.get("message"):
            info = response.status_code
            info = int(info)
            raise Exception(payload["message"])
    return payload


@convert_kwargs_to_snake_case
def resolve_topics(obj, info, token, page):
    response = requests.get(
        url=url_for("topics.multipletopicviews", _external=True),
        json={"page": page},
        headers={
            "content-type": "application/json",
            "Authorization": f"Bearer {token}"
        }
    )
    if response.json():
        payload = response.json()
        if payload.get("data"):
            return payload
        elif payload.get("message"):
            info = response.status_code
            info = int(info)
            raise Exception(payload["message"])
