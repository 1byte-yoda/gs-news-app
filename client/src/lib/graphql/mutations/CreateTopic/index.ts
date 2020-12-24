import { gql } from "apollo-boost";

export const CREATE_TOPIC = gql`
    mutation createTopic(
      $token: String!
      $subject: String!
      $description: String!
    ) {
      topic_create(
        token: $token
        subject: $subject
        description: $description
      ) {
        id
        subject
        description
        created_by { id name avatar email created_at updated_at }
        updated_by { id name avatar email created_at updated_at }
        created_at
        updated_at
        messages { 
          id
          message
          created_by { id name avatar email created_at updated_at }
          updated_by { id name avatar email created_at updated_at }
        }
    }
  }
`;
