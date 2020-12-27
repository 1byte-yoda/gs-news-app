# server/app/api/graphql/topics/mutations.py


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
        if payload.get("data"):
            payload = payload.get("data")
            return payload
    if response.status_code != 201:
        payload = response.json()
        raise Exception(payload.get("message"))


@convert_kwargs_to_snake_case
def resolve_topic_update(obj, info, token, id, subject, description):
    data = {
        "subject": subject,
        "description": description
    }
    url = url_for("topics.singletopicviews", id=id, _external=True)
    response = requests.patch(
        url=url,
        json=data,
        headers={
            "content-type": "application/json",
            "Authorization": f"Bearer {token}"
        }
    )
    if response.json():
        payload = response.json()
        if payload.get("data"):
            payload = payload.get("data")
            return payload
    if response.status_code != 200:
        payload = response.json()
        info = response.status_code
        info = int(info)
        raise Exception(payload.get("message"))


@convert_kwargs_to_snake_case
def resolve_topic_delete(obj, info, token, id):
    url = url_for("topics.singletopicviews", id=id, _external=True)
    response = requests.delete(
        url=url,
        headers={
            "content-type": "application/json",
            "Authorization": f"Bearer {token}"
        }
    )
    if response.json():
        payload = response.json()
        if payload.get("success"):
            payload = payload.get("success")
            return payload
        elif payload.get("message"):
            info = response.status_code
            info = int(info)
            raise Exception(payload["message"])
