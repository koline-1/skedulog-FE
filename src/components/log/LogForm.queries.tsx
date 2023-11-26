import { gql } from "@apollo/client";

export const CREATE_LOG = gql`
    mutation CreateLog($value: Int!, $unit: Int!, $schedule: Int!) {
        createLog(value: $value, unit: $unit, schedule: $schedule) {
            id
        }
    }
`;

export const UPDATE_LOG = gql`
    mutation UpdateLog($id: Int!, $value: Int, $unit: Int) {
        updateLog(id: $id, value: $value, unit: $unit) {
            id
        }
    }
`;

export const DELETE_LOG = gql`
    mutation DeleteLog($id: Int!) {
        deleteLog(id: $id)
    }
`;
