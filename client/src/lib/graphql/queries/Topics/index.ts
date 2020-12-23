import { gql } from "apollo-boost";

export const TOPICS = gql`
    query getAllTopics(
        $token: String!
        $page: Int!
    ) {
        topics(
            token: $token
            page: $page
        ) {
            data {
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
            },
            next_num,
            has_next
        }
    }
`;
