# server/app/api/graphql/users/__init__.py


from gql import query, mutation
from app.api.graphql.users.mutations import (
    resolve_user_register,
    resolve_user_login
)
from app.api.graphql.users.queries import (
    resolve_user_logout,
    resolve_user
)

# queries
query.set_field("user", resolve_user)
query.set_field("user_logout", resolve_user_logout)

# mutations
mutation.set_field("user_register", resolve_user_register)
mutation.set_field("user_login", resolve_user_login)
