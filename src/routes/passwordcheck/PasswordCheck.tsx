import { useEffect } from "react";
import { useForm } from "antd/es/form/Form";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import PageTitle from "../../components/pagetitle/PageTitle";
import styles from "./PasswordCheck.module.scss";
import { Button, Form, Input, message } from "antd";
import { MemberInterface } from "../../interfaces/member/MemberInterface";
import { hashPassword } from "../../crypto/Crypto";
import { getUsername } from "../../cookie/Cookie";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { useDispatch } from "react-redux";
import { SET_VERIFIED } from "../../redux/Verification";
import { handleFinishFailed } from "../../handlers/UtilityHandlers";
import { PASSWORD_CHECK } from "./PasswordCheck.queries";

const PassWordCheck: React.FC = () => {

    const { setTitle } = useDocumentTitle();
    useEffect(() => {
        setTitle('회원정보');
    }, [])
    
    const [form] = useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [passwordCheck] = useMutation(PASSWORD_CHECK, {
        onCompleted: (data) => {
            const handleSuccess = () => {
                dispatch(SET_VERIFIED());
                navigate('/member/me')
            }
            data.passwordCheck === true ? handleSuccess() : message.error('비밀번호를 확인하여 주세요.', 2);
        }
    });

    const handleFinish = (data: MemberInterface) => {
        const password = data.password;
        passwordCheck({ variables: { password: hashPassword(getUsername(), password ?? '') } })
    }

    return (
        <div className={styles.password_check_form_container}>
            <PageTitle title="회원정보" />
            <div className={styles.password_check_form}>
                <Form 
                    form={form} 
                    name="passwordCheckForm"
                    requiredMark={false}
                    layout="vertical"
                    onFinish={handleFinish}
                    onFinishFailed={handleFinishFailed}
                >
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "비밀번호는 필수입력 항목입니다."
                            }
                        ]}
                        validateTrigger={["onBlur"]}
                    >
                        <Input
                            placeholder="비밀번호를 입력하여 주세요."
                            type="password"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button block type="primary" size="large" htmlType="submit">인증</Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

export default PassWordCheck;