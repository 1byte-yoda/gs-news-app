import { gql } from "apollo-boost";

export const CREATE_MESSAGE = gql`
    mutation createMessage(
        $token: String!
        $topic_id: ID!
        $message: String!
    ) {
        message_create(
            token: $token
            topic_id: $topic_id
            message: $message
        ) {
            id
            message
            created_by { id name avatar email created_at updated_at }
            updated_by { id name avatar email created_at updated_at }
            created_at
            updated_at
        }
    }
`;