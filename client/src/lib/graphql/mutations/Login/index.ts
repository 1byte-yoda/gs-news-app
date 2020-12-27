import { gql } from "apollo-boost";

export const LOG_IN = gql`
    mutation userLogin(
        $email: String!
        $password: String!
    ) {
        user_login(
            email: $email
            password: $password
        ) {
            token
        }
    }
`;
