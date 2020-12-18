# server/app/api/__init__.py

import os
from flask import (
    request,
    jsonify,
    current_app
)
from ariadne import (
    graphql_sync,
    make_executable_schema,
    load_schema_from_path,
    snake_case_fallback_resolvers,
    ObjectType
)
from ariadne.constants import PLAYGROUND_HTML
from app.api.topics.graphql_queries import (
    resolve_topics,
    resolve_topic
)
from app.api.topics.graphql_mutations import (
    resolve_topic_create,
    resolve_topic_update,
    resolve_topic_delete
)
from app.api.messages.graphql_mutations import (
    resolve_message_create
)

base_dir = os.path.abspath(
    os.path.dirname(os.path.dirname(__file__))
)
graphql_file_dir = os.path.join("graphql-schema", "gs-schema.graphql")
type_defs = load_schema_from_path(graphql_file_dir)

# GQL Queries
query = ObjectType("Query")
query.set_field("topics", resolve_topics)
query.set_field("topic", resolve_topic)

# GQL Mutations
mutation = ObjectType("Mutation")
mutation.set_field("topic_create", resolve_topic_create)
mutation.set_field("topic_update", resolve_topic_update)
mutation.set_field("topic_delete", resolve_topic_delete)
mutation.set_field("message_create", resolve_message_create)


schema = make_executable_schema(
    type_defs, mutation, query, snake_case_fallback_resolvers
)


def graphql_playground():
    """User interface for writing graphql queries."""
    return PLAYGROUND_HTML, 200


def graphql_server():
    data = request.get_json()
    success, result = graphql_sync(
        schema,
        data,
        context_value=request,
        debug=current_app.debug
    )
    status_code = 200 if success else 400
    return jsonify(result), status_code

def ping_pong():
    """Check application"s health"""
    return jsonify({
        "status": "success",
        "message": "pong!"
    })
