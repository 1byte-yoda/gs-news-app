# server/app/api/graphql/messages/__init__.py


from gql import query, mutation
from app.api.graphql.messages.queries import (
    resolve_messages
)
from app.api.graphql.messages.mutations import (
    resolve_message_create
)

query.set_field("messages", resolve_messages)
mutation.set_field("message_create", resolve_message_create)
