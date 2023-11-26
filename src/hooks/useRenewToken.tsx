import { ApolloError, gql, useMutation } from "@apollo/client";
import { useDispatch } from 'react-redux';
import { SET_TOKEN } from "../redux/Auth";
import { GraphQLErrorInterface } from "../interfaces/error/GraphQLErrorInterface";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { removeStoredMemberData } from "../handlers/UtilityHandlers";
import { AuthTokenStateInterface } from "../interfaces/state/AuthTokenStateInterface";
import { getUsername } from "../cookie/Cookie";

const RENEW = gql`
    mutation Renew(
        $username: String!
    ) {
        renew(username: $username)
    }
`;

const useRenewToken = () => {
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [renew] = useMutation(RENEW, {
        onError: (error: ApolloError) => {
            const gqlError = (error.graphQLErrors[0] as unknown) as GraphQLErrorInterface;
            const code = gqlError.extensions.http.code;
            if (code === 'INVALID_REFRESH_TOKEN') {
                message.error('로그인이 만료되었습니다.');
                removeStoredMemberData();
                navigate('/login');
            }
        },
        onCompleted: (data) => {
            const response = JSON.parse(data.renew);
            response && dispatchToken({ accessToken: response.renewedToken, expirationTime: response.exp });
        }
    });
    
    const renewToken = async () => {
        await renew({ variables: { username: getUsername() }});
    };

    const dispatchToken = async (authTokenState: AuthTokenStateInterface) => {
        dispatch(SET_TOKEN(authTokenState));
        setTimeout(renewToken, (authTokenState.expirationTime || (new Date().getTime() + (30 * 60 * 1000))) - (new Date().getTime()) - (2 * 60 * 1000));
    }

    return { renewToken, dispatchToken };
}

export default useRenewToken;