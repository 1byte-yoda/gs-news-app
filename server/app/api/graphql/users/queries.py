# server/app/api/graphql/users/queries.py


import requests
from ariadne import convert_kwargs_to_snake_case
from flask import url_for


@convert_kwargs_to_snake_case
def resolve_user_logout(obj, info, token):
    url = url_for("users.userlogout",  _external=True)
    response = requests.get(
        url=url,
        headers={
            "content-type": "application/json",
            "Authorization": f"Bearer {token}"
        }
    )
    if response.json():
        payload = response.json()
        if response.status_code != 200:
            info = response.status_code
            info = int(info)
            raise Exception(payload["message"])
    return payload


@convert_kwargs_to_snake_case
def resolve_user(obj, info, token, id):
    url = url_for("users.singleuserviews", id=id, _external=True)
    response = requests.get(
        url=url,
        headers={
            "content-type": "application/json",
            "Authorization": f"Bearer {token}"
        }
    )
    if response.json():
        payload = response.json()
        if response.status_code != 200:
            info = response.status_code
            info = int(info)
            raise Exception(payload["message"])
    return payload
