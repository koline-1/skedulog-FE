import { useSelector } from 'react-redux';
import { RootStateInterface } from "../interfaces/state/RootStateInterface";
import useRenewToken from "./useRenewToken";
import { getUsername } from '../cookie/Cookie';

const useCheckToken = () => {

    const { accessToken } = useSelector((state:RootStateInterface) => state.authToken);
    const username = getUsername();
    const { renewToken } = useRenewToken();

    const checkAuth = async() => {
        (username && !accessToken) && await renewToken();
    }

    return { checkAuth };
}

export default useCheckToken;