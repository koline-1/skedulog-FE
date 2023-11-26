import { useLocation } from "react-router-dom";

const useURLParam: Function = (parameter: string) => {

    const location = useLocation();
    
    return new URLSearchParams(location.search).get(parameter) || null
}

export default useURLParam;