import { gql } from "@apollo/client";

export const GET_MEMBER = gql`
    query Member {
        member {
            id
            username
            password
            fullName
            gender
            dateOfBirth
        }
    }
`;

export const UPDATE_MEMBER = gql`
    mutation UpdateMember($id: Int!, $password: String, $fullName: String, $gender: String, $dateOfBirth: Date) {
        updateMember(id: $id, password: $password, fullName: $fullName, gender: $gender, dateOfBirth: $dateOfBirth) {
            id
        }
    }  
`;

export const DELETE_MEMBER = gql`
    mutation DeleteMember {
        deleteMember
    }
`;
