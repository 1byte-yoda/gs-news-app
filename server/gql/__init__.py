# server/gql/__init__.py


import os
from flask import (
    request,
    jsonify,
    current_app,
    Blueprint
)
from flask_restful import Resource, Api
from ariadne import (
    graphql_sync,
    make_executable_schema,
    load_schema_from_path,
    snake_case_fallback_resolvers,
    ObjectType
)


query = ObjectType("Query")
mutation = ObjectType("Mutation")


from app.api.graphql import messages, topics, users


base_dir = os.path.abspath(
    os.path.dirname(os.path.dirname(__file__))
)
graphql_file_dir = os.path.join("gql", "gs-schema.graphql")
type_defs = load_schema_from_path(graphql_file_dir)
schema = make_executable_schema(
    type_defs, mutation, query, snake_case_fallback_resolvers
)


class GQL:
    def init_app(self, app):
        @app.route("/graphql", methods=["POST"])
        def post():
            data = request.get_json()
            success, result = graphql_sync(
                schema,
                data,
                context_value=request,
                debug=app.debug
            )
            status_code = 200 if success else 400
            return jsonify(result), status_code
