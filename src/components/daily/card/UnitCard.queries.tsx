import { gql } from "@apollo/client";

export const GET_UNIT = gql`
    query Unit($name: String) {
        unit(name: $name) {
            id
            name
        }
    }
`;

export const CREATE_UNIT = gql`
    mutation CreateUnit($name: String!) {
        createUnit(name: $name) {
            id
        }
    }
`;