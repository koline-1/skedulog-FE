import { Cookies } from 'react-cookie';

const cookies = new Cookies();

/**
 * 사용자 아이디를 쿠키에 저장
 * @param username 사용자 아이디
 * @returns void
 */
export const setUsername = (username: string) => {
    return cookies.set('username', username, {
        sameSite: 'strict',
        path: '/',
    });
}

/**
 * 쿠키에 저장된 사용자 아이디을 조회
 * @returns 쿠키에 저장된 사용자 아이디
 */
export const getUsername = () => {
    return cookies.get('username') as string;
}

/**
 * 쿠키에 저장된 사용자 아이디 삭제
 * @returns void
 */
export const removeUsername = () => {
    return cookies.remove('username', {
        sameSite: 'strict',
        path: '/',
    });
}