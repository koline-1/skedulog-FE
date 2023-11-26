import { removeUsername } from "../cookie/Cookie";
import { DELETE_TOKEN } from "../redux/Auth";
import { UNSET_VERIFIED } from "../redux/Verification";
import store from "../redux/ConfigureStore.tsx";
import { message } from "antd";

/**
 * 오늘 날짜를 'YYYY-MM-DD' 형태로 return
 * @returns 'YYYY-MM-DD' 형태의 오늘 날짜
 */
export const getTodayAsString = (): string => {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth()+1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

/**
 * Array 형태의 object를 받아서 string으로 변환
 * @param array 파싱할 대상 object[]
 * @param name 대상의 이름
 * @param divider 값 사이에 들어갈 string
 * @param nameDivider 이름 사이에 들어갈 string
 * @returns 변환된 string
 */
export const parseArrayToString: Function = (target: any[], name: string[], divider: string, nameDivider: string) : string => {
    let result = '';
    if (!target.length) return result;

    for (let each of target) {
        result += result === '' ? `${parseObjectToString(each, name, nameDivider)}` : `${divider} ${parseObjectToString(each, name, nameDivider)}`
    }

    return result;
}

/**
 * object를 받아서 string으로 변환
 * @param target 파싱할 대상 object
 * @param name 대상 attributes
 * @param divider 각 attribute 사이에 들어갈 string
 * @returns 
 */
export const parseObjectToString = (target: any, name: string[], divider: string) => {
    let result = '';

    for (let each of name) {
        if (each.includes('.')) {
            const arr = each.split('.');
            let tmp;
            for (let i = 0; i < arr.length; i++) {
                if (tmp === null) return tmp;
                if (i === 0) {
                    tmp = target[arr[0]];
                } else if (i !== arr.length-1) {
                    tmp = tmp ? tmp[arr[i]] : null;
                } else {
                    result += result === '' ? `${tmp[arr[i]]}` : `${divider}${tmp[arr[i]]}`;
                }
            }
        } else {
            result += result === '' ? `${target[each]}` : `${divider}${target[each]}`;
        }
    }

    return result;
}

/**
 * Array 형태로된 객체에 key를 추가하여 return
 * @param target key를 추가할 대상 객체(Array)
 * @returns key가 추가된 객체
 */
export const addKeyToObject = (target: any[]) => {
    if (target && target.length > 0) {
        [].forEach.call(target, (each: any) => {
            each = {...each, key: each.id}
        })
    }

    return target;
}

/**
 * 쿠키와 Redux에 저장된 회원 정보를 삭제
 */
export const removeStoredMemberData = () => {
    store.dispatch(DELETE_TOKEN());
    store.dispatch(UNSET_VERIFIED());
    removeUsername();
}

/**
 * antd의 form의 onFinishFailed 발생 시 에러를 message로 띄운다
 * @param error antd form onFinishFailed 파라미터
 */
export const handleFinishFailed = (error: any) => {
    [].forEach.call(error.errorFields, (field: any) => {
        [].forEach.call(field.errors, (each: any) => {
            message.error(each, 2);
        })
    })
}