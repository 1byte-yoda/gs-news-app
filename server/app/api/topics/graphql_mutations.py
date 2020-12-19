# server/app/api/topics/graphql_mutations.py


from ariadne import convert_kwargs_to_snake_case
from flask import url_for
import requests


@convert_kwargs_to_snake_case
def resolve_topic_create(obj, info, token, subject, description):
    data = {
        "subject": subject,
        "description": description
    }
    url = url_for("topics.createtopicview", _external=True)
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


@convert_kwargs_to_snake_case
def resolve_topic_update(obj, info, token, id, subject, description):
    data = {
        "subject": subject,
        "description": description
    }
    url = url_for("topics.singletopicviews", id=id, _external=True)
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


@convert_kwargs_to_snake_case
def resolve_topic_delete(obj, info, token, id):
    url = url_for("topics.singletopicviews", id=id, _external=True)
    payload = requests.delete(
        url=url,
        headers={
            "content-type": "application/json",
            "Authorization": f"Bearer {token}"
        }
    )
    if payload.json():
        payload = payload.json()
        if payload.get("success"):
            payload = payload.get("success")
        elif payload.get("message"):
            raise Exception(payload["message"])
    return payload
