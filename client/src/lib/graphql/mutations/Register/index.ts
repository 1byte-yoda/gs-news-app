import { gql } from "apollo-boost";

const REGISTER = gql`
    mutation userRegister(
        $email: String!
        $name: String!
        $password: String!
    ) {
        user_register(
            email: $email
            name: $name
            password: $password
        ) 
        {
            id
            name
            avatar
            email
            created_at
            updated_at
        }
    }
`;