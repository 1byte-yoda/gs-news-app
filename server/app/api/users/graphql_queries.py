# server/app/api/users/graphql_queries.py


import requests
from ariadne import convert_kwargs_to_snake_case
from flask import url_for


@convert_kwargs_to_snake_case
def resolve_user_logout(obj, info, token):
    url = url_for("users.userlogout",  _external=True)
    payload = requests.get(
        url=url,
        headers={
            "content-type": "application/json",
            "Authorization": f"Bearer {token}"
        }
    )
    return payload.json()
    if payload.status_code == 200:
        payload = payload.json()
        return payload
    else:
        raise Exception(payload.get("message"))
