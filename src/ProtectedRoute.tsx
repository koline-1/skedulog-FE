import { useEffect } from "react";
import { useSelector } from "react-redux"
import { Navigate, useLocation } from "react-router-dom"
import { RootStateInterface } from "./interfaces/state/RootStateInterface"
import { RequireAnonymityInterface, RequireAuthInterface } from "./interfaces/protectedroute/ProtectedRouteInterface";
import { message } from "antd"


/**
 * 로그인이 되어 있을 시 children 컴포넌트를 로드하고 되어있지 않으면 navigate한다.
 * @param {ReactNode} children 로그인 되어 있을 시 로드할 컴포넌트 
 * @param {string?} redirectTo 로그인 되어 있지 않을 시 navigate할 주소 (default: '/login')
 * @param {string?} returnTo 로그인 이후 navigate될 주소 (default: '/')
 * @param {string?} errorMessage 로그인 되어 있지 않다면 표시될 메세지
 * @returns {ReactNode} children || redirectTo 로 navigate
 */
export const RequireAuth: Function = ({ children, redirectTo, returnTo, errorMessage }: RequireAuthInterface) => {
    const isAuthenticated = useSelector((state: RootStateInterface) => !!state.authToken.accessToken);
    
    useEffect(() => {
        (!isAuthenticated && errorMessage) && message.error(errorMessage, 2);
    }, [])

    return isAuthenticated ? children : <Navigate to={redirectTo ?? '/login'} state={{ returnUrl: returnTo }} />
}

/**
 * 로그인이 되어 있지 않을 시 children 컴포넌트를 로드하고 되어있으면 navigate한다.
 * @param {ReactNode} children 로그인 되어 있지 않을 시 로드할 컴포넌트 
 * @param {string?} redirectTo 로그인 되어 있을 시 navigate할 주소 (default: '/')
 * @param {string?} errorMessage 로그인 되어 있다면 표시될 메세지
 * @returns {ReactNode} children || redirectTo 로 navigate
 */
export const RequireAnonymity: Function = ({ children, redirectTo, errorMessage } : RequireAnonymityInterface) => {
    const { state } = useLocation()
    const returnUrl = state?.returnUrl || redirectTo;
    const isAuthenticated = useSelector((state: RootStateInterface) => !!state.authToken.accessToken);

    useEffect(() => {
        (isAuthenticated && errorMessage) && message.error(errorMessage, 2);
    }, [])
    
    return isAuthenticated ? <Navigate to={returnUrl || '/'} /> : children;
}