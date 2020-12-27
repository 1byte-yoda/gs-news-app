import { gql } from "apollo-boost";

export const UPDATE_TOPIC = gql`
    mutation updateTopic(
        $token: String!
        $topic_id: ID!
        $subject: String!
        $description: String!
    ) {
        topic_update(
            token: $token
            id: $topic_id
            subject: $subject
            description: $description
        ) {
            id
            subject
            description
            created_by { id name avatar email created_at updated_at }
            updated_by { id name email created_at updated_at }
            created_at
            updated_at
            deleted_at
            messages { 
            id
            message
            created_by { id name avatar email created_at updated_at }
            updated_by { id name avatar email created_at updated_at }
            }
        }
    }
`;