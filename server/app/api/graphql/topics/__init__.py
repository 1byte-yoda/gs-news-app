# server/app/api/graphql/topics/__init__.py


from gql import query, mutation
from app.api.graphql.topics.mutations import (
    resolve_topic_create,
    resolve_topic_update,
    resolve_topic_delete
)
from app.api.graphql.topics.queries import (
    resolve_topics,
    resolve_topic
)

# queries
query.set_field("topics", resolve_topics)
query.set_field("topic", resolve_topic)

# mutations
mutation.set_field("topic_create", resolve_topic_create)
mutation.set_field("topic_update", resolve_topic_update)
mutation.set_field("topic_delete", resolve_topic_delete)
