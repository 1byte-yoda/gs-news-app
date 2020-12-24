import { gql } from "apollo-boost";


export const DELETE_TOPIC = gql`
    mutation deleteTopic(
        $token: String!
        $topic_id: ID!
    ) {
        topic_delete(
            token: $token
            id: $topic_id
        )
    }
`;
