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
    mutation CreateUnit($unitName: String!) {
        createUnit(name: $unitName) {
            id
            name
        }
    }
`;

export const CREATE_SCHEDULE = gql`
    mutation CreateSchedule($scheduleName: String!, $units: [Int], $parent: Int) {
        createSchedule(name: $scheduleName, units: $units, parent: $parent) {
            id
        }
    }
`;

export const UPDATE_SCHEDULE = gql`
    mutation UpdateSchedule($scheduleId: Int!, $scheduleName: String, $units: [Int]) {
        updateSchedule(id: $scheduleId, name: $scheduleName, units: $units) {
            name
        }
    }
`;

export const DELETE_SCHEDULE = gql`
    mutation DeleteSchedule($id: Int!) {
        deleteSchedule(id: $id)
    }
`;

export const CREATE_LOG = gql`
    mutation CreateLog($value: Int!, $unit: Int!, $schedule: Int!) {
        createLog(value: $value, unit: $unit, schedule: $schedule) {
            id
            value
            unit {
                id
                name
            }
        }
    }
`;

export const UPDATE_LOG = gql`
    mutation UpdateLog($id: Int!, $value: Int, $unit: Int) {
        updateLog(id: $id, value: $value, unit: $unit) {
            id
            value
            unit {
                id
                name
            }
        }
    }
`;

export const DELETE_LOG = gql`
    mutation DeleteLog($id: Int!) {
        deleteLog(id: $id) 
    }
`;
