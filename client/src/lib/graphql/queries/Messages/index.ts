import { gql } from "apollo-boost";

export const MESSAGES = gql`
    query getMessages($token: String! $page: Int! $topic_id: String!) {
    messages(token: $token, page: $page, topic_id: $topic_id) {
      has_next
      next_num
      data {
        id
        message
        created_by { id avatar name email created_at updated_at }
        updated_by { id avatar name email created_at updated_at }
        created_at
        updated_at
      }
    }
}`;
