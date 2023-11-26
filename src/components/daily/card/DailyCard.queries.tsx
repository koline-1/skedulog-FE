import { gql } from "@apollo/client";

export const GET_TOP_LEVEL_SCHEDULES = gql`
    query GetTopLevelSchedules($createdBy: String!, $createdAt: Date!) {
        allSchedulesByMember(createdBy: $createdBy, createdAt: $createdAt) {
            id
            name
            units {
                id
                name
            }
            scheduleData {
                id
                name
                units {
                    id
                    name
                }
            }
            logData {
                id
                value
                unit {
                    id
                    name
                }
            }
        }
    }
`;

export const GET_SCHEDULE = gql`
    query Schedule($id: Int!, $createdAt: Date) {
        schedule(id: $id, createdAt: $createdAt) {
            id
            name
            depth
            parent {
                id
                name
                parent {
                    id
                    name
                    parent {
                        id
                        name 
                        parent {
                            id
                            name
                        }
                    }
                }
            }
            units {
                id
                name
            }
            scheduleData {
                id
                name
                depth
                units {
                    id
                    name
                }
                scheduleData {
                    id
                    name
                    units {
                        id
                        name
                    }
                }
                logData {
                    id
                    value
                    unit {
                        id
                        name
                    }
                }
                createdBy {
                    username
                }
            }
            logData {
                id
                value
                unit {
                    id
                    name
                }
            }
            createdBy {
                username
            }
        }
    }
`;

export const UPDATE_SCHEDULE = gql`
    mutation UpdateSchedule($id: Int!, $name: String, $units: [Int]) {
        updateSchedule(id: $id, name: $name, units: $units) {
            id
        }
    }
`;