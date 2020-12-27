import { gql } from "apollo-boost";

export const USER = gql`
  query getUser($token: String!, $id: ID!) {
    user(token: $token, id: $id) {
      id
      name
      avatar
      email
      created_at
      updated_at
      total_topics
      total_messages
    }
  }
`;
