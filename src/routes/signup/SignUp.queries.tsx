import { gql } from "@apollo/client";

/**
 * 회원가입
 */
export const SIGN_UP = gql`
    mutation SignUp(
        $createMemberUsername: String!,
        $createMemberPassword: String!,
        $createMemberFullName: String!,
        $createMemberGender: String!,
        $createMemberDateOfBirth: Date!
    ) {
        createMember(
            username: $createMemberUsername, 
            password: $createMemberPassword, 
            fullName: $createMemberFullName,
            gender: $createMemberGender,
            dateOfBirth: $createMemberDateOfBirth
        ) {
            id
        }
    }
`;

/**
 * 아이디 중복 확인
 */
export const CHECK_USERNAME_DUPLICACY = gql`
    mutation CheckUsernameDuplicacy(
        $username: String!
    ) {
        checkUsernameDuplicacy(
            username: $username
        )
    }
`;