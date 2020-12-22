# server/app/api/users/graphql_mutations.py


from ariadne import convert_kwargs_to_snake_case
from flask import url_for
import requests


@convert_kwargs_to_snake_case
def resolve_user_register(obj, info, name, email, password):
    data = {
        "name": name,
        "email": email,
        "password": password
    }
    url = url_for("users.userregister", _external=True)
    payload = requests.post(
        url=url,
        json=data,
        headers={"content-type": "application/json"}
    )
    if payload.json():
        payload = payload.json()
        if payload.get("data"):
            payload = payload.get("data")
    return payload


@convert_kwargs_to_snake_case
def resolve_user_login(obj, info, email, password):
    data = {
        "email": email,
        "password": password
    }
    url = url_for("users.userlogin", _external=True)
    payload = requests.post(
        url=url,
        json=data,
        headers={"content-type": "application/json"}
    )
    data = payload.json()
    if payload.status_code == 200:
        return data
    raise Exception(data.get("message"))
