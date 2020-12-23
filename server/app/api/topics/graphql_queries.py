# server/app/api/topics/graphql_queries.py


import requests
from ariadne import convert_kwargs_to_snake_case
from flask import url_for


@convert_kwargs_to_snake_case
def resolve_topic(obj, info, token, id):
    url = url_for("topics.singletopicviews", id=id, _external=True)
    payload = requests.get(
        url=url,
        headers={
            "content-type": "application/json",
            "Authorization": f"Bearer {token}"
        }
    )
    if payload.json():
        payload = payload.json()
        if payload.get("data"):
            payload = payload.get("data")
        elif payload.get("message"):
            raise Exception(payload["message"])
    return payload


@convert_kwargs_to_snake_case
def resolve_topics(obj, info, token, page):
    payload = requests.get(
        url=url_for("topics.multipletopicviews", _external=True),
        json={"page": page},
        headers={
            "content-type": "application/json",
            "Authorization": f"Bearer {token}"
        }
    )
    if payload.json():
        payload = payload.json()
        if payload.get("topics"):
            payload = payload.get("topics")
    return payload
