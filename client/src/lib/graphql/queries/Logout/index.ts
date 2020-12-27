import { gql } from "apollo-boost";

export const LOG_OUT = gql`
    query userLogout($token: String!) {
        user_logout(token: $token) {
            message
    }
}`;
