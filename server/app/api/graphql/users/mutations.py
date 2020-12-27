# server/app/api/graphql/users/mutations.py


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
    response = requests.post(
        url=url,
        json=data,
        headers={"content-type": "application/json"}
    )
    if response.json():
        payload = response.json()
        if payload.get("data"):
            payload = payload.get("data")
            return payload
    if response.status_code != 201:
        payload = response.json()
        info = response.status_code
        info = int(info)
        raise Exception(payload.get("message"))


@convert_kwargs_to_snake_case
def resolve_user_login(obj, info, email, password):
    data = {
        "email": email,
        "password": password
    }
    url = url_for("users.userlogin", _external=True)
    response = requests.post(
        url=url,
        json=data,
        headers={"content-type": "application/json"}
    )
    data = response.json()
    if response.status_code == 200:
        return data
    if response.status_code != 200:
        info = response.status_code
        info = int(info)
        raise Exception(data.get("message"))
