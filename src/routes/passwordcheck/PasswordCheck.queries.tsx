import { gql } from "@apollo/client";

export const PASSWORD_CHECK = gql`
    mutation PasswordCheck($password: String!) {
        passwordCheck(password: $password)
    }
`;