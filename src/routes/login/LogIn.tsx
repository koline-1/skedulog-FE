import styles from './LogIn.module.scss'
import { LogInInterface } from '../../interfaces/login/LogInInterface';
import { useForm } from "antd/es/form/Form";
import { Button, Form, Input, Space, Typography } from "antd"
import { useMutation } from "@apollo/client";
import { useEffect } from "react";
import { setUsername } from "../../cookie/Cookie";
import PageTitle from '../../components/pagetitle/PageTitle';
import { hashPassword } from '../../crypto/Crypto';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { handleFinishFailed } from '../../handlers/UtilityHandlers';
import useRenewToken from '../../hooks/useRenewToken';
import { LOG_IN } from './LogIn.queries';

const { Text } = Typography;

const LogIn: React.FC = () => {

    const { setTitle } = useDocumentTitle();
    useEffect(() => {
        setTitle('로그인');
    }, [])

    const [form] = useForm();
    const [logIn] = useMutation(LOG_IN, {
        onCompleted: (data) => {
            const response = JSON.parse(data.login);
            setUsername(form.getFieldValue('username'));
            dispatchToken({ accessToken: response.accessToken, expirationTime: response.exp });
            navigate(state?.returnUrl ?? '/');
        } 
    });

    const navigate = useNavigate();
    const { state } = useLocation();
    const { dispatchToken } = useRenewToken();

    const handleFinish = (data: LogInInterface) => {
        logIn({ variables: { username: data.username, password: hashPassword(data.username, data.password) }});
    }

    return (
        <div className={styles.log_in_form_container}>
            <PageTitle title='로그인' />
            <div className={styles.log_in_form}>
                <Form form={form} name="logInForm" layout="vertical" onFinish={handleFinish} onFinishFailed={handleFinishFailed}>
                    <Form.Item
                        name="username" 
                        label="아이디" 
                        rules={[
                            {
                                required: true,
                                message: "아이디를 입력하여 주세요."
                            }
                        ]}
                        validateTrigger={['onBlur']}
                    >
                        <Input 
                            maxLength={20}
                        />
                    </Form.Item>
                    <Form.Item
                        name="password" 
                        label="비밀번호" 
                        rules={[
                            {
                                required: true,
                                message: "비밀번호를 입력하여 주세요."
                            }
                        ]}
                        validateTrigger={['onBlur']}
                    >
                        <Input
                            type='password'
                            maxLength={20}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button block size='large' type='primary' htmlType='submit'>로그인</Button>
                        <Space className={styles.form_text}>
                            <Text>아직 회원이 아니신가요?</Text>
                            <Link to='/signup'>
                                <Text className={styles.form_text_link}>
                                    회원가입
                                </Text>
                            </Link>
                        </Space>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default LogIn;