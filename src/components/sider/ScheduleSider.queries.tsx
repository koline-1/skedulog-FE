import { gql } from "@apollo/client";

export const ALL_SCHEDULES_BY_MEMBER = gql`
    query AllSchedulesByMember($createdBy: String!, $createdAt: Date!) {
        allSchedulesByMember(createdBy: $createdBy, createdAt: $createdAt) {
            id
            name
            scheduleData {
                id
                name
                scheduleData {
                    id
                    name
                    scheduleData {
                        id
                        name
                        scheduleData {
                            id
                            name
                        }
                    }
                }
            }
        }
    }
`;
