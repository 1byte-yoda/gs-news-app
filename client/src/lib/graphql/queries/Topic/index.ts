import { gql } from "apollo-boost";

export const TOPIC = gql`
    query getTopic($topic_id: ID!, $token: String!) {
        topic(id: $topic_id, token: $token) {
            id
            subject
            description
            created_by { id name avatar email created_at updated_at }
            updated_by { id name avatar email created_at updated_at }
            created_at
            updated_at
            deleted_at
            messages { 
                id
                message
                created_by { id name avatar email created_at updated_at }
                updated_by { id name avatar email created_at updated_at }
                created_at
                updated_at
            }
        }
    }
`;
