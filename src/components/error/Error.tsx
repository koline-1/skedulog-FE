import { Button, Result } from "antd";
import { ErrorInterface } from "../../interfaces/error/ErrorInterface";
import { useNavigate } from "react-router-dom";
import styles from "./Error.module.scss";

/**
 * 에러페이지 컴포넌트 뷰
 * @param {ResultStatusType} status 에러 status
 * @param {string} title 페이지 제목
 * @param {string} subTitle 페이지 부제목
 * @param {string} buttonText 버튼에 들어갈 문구
 * @param {Function} onClick 버튼 클릭시 실행될 함수
 * @returns {ReactNode} 에러페이지
 */
const Error: React.FC<ErrorInterface> = ({ status, title, subTitle, buttonText, onClick}) => {

    const navigate = useNavigate();

    return (
        <div className={styles.error_container}>
            <Result
                className={styles.error}
                status={status}
                title={title}
                subTitle={subTitle || null}
                extra={<Button onClick={onClick || (() => navigate(-1))} size="large" type="primary">{buttonText || '뒤로'}</Button>}
            />
        </div>
    );
}

export default Error;

