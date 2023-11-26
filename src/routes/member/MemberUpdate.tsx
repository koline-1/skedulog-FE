import { ApolloError, useLazyQuery, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { MemberInterface } from "../../interfaces/member/MemberInterface";
import { useForm } from "antd/es/form/Form";
import { Button, DatePicker, Form, Input, Modal, Select, Space, Typography, message } from "antd";
import { useApolloClient } from "@apollo/client";
import styles from "./MemberUpdate.module.scss"
import dayjs from "dayjs";
import PageTitle from "../../components/pagetitle/PageTitle";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { hashPassword } from "../../crypto/Crypto";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { GraphQLErrorInterface } from "../../interfaces/error/GraphQLErrorInterface";
import { ValidationResultInterface } from "../../interfaces/error/ValidationResultInterface";
import weekday from "dayjs/plugin/weekday"
import localeData from "dayjs/plugin/localeData"
import { RootStateInterface } from "../../interfaces/state/RootStateInterface";
import { handleFinishFailed, removeStoredMemberData } from "../../handlers/UtilityHandlers";
import { GET_MEMBER, UPDATE_MEMBER, DELETE_MEMBER } from "./MemberUpdate.queries";

dayjs.extend(weekday)
dayjs.extend(localeData)

const { Text } = Typography;

const PASSWORD_COVER_TEXT = '**********';

const MemberUpdate: React.FC = () => {

    const navigate = useNavigate();
    const isVerified = useSelector((state: RootStateInterface) => state.verification.isVerified);

    const errorHandler = (err: ApolloError) => {
        const gqlError = (err.graphQLErrors[0] as unknown) as GraphQLErrorInterface;
        const result = gqlError.extensions.http.validationResult;
        
        [].forEach.call(result, (each: ValidationResultInterface) => {
            message.error(each.error.message, 2);
        })
    }

    const [getMember] = useLazyQuery(GET_MEMBER, {
        onCompleted: (data) => setMember(data.member)
    });

    const [updateMember] = useMutation(UPDATE_MEMBER, { 
        onError: errorHandler,
        onCompleted: () => {
            message.success('회원 정보가 수정되었습니다.', 2);
            setIsUpdateModalOpen(false);
        }
    });

    const [deleteMember] = useMutation(DELETE_MEMBER, {
        onCompleted: (data) => {
            if (data.deleteMember === true) {
                removeStoredMemberData();
                client.cache.evict({ id: 'ROOT_QUERY', fieldName: 'member' })
                client.cache.gc();
                message.success('회원 탈퇴가 완료되었습니다.', 2);
                navigate('/');
            } else {
                message.error("알 수 없는 오류가 발생 하였습니다.");
            }
        }
    });

    const { setTitle } = useDocumentTitle();
    useEffect(() => {
        isVerified ? getMember() : navigate('/password/check');
        setTitle('회원정보');
    }, [])
    
    const [form] = useForm();
    const [member, setMember] = useState<MemberInterface>();
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const client = useApolloClient();

    const worker = {
        ...member,
        dateOfBirth: dayjs(member?.dateOfBirth),
        password: PASSWORD_COVER_TEXT,
        confirmPassword: PASSWORD_COVER_TEXT
    };

    const validatePassword = (_: object, password: string) => {

        if (!password) {
            form.setFieldValue('password', PASSWORD_COVER_TEXT)
            return Promise.resolve();
        }

        if (password?.length < 8 || password?.length > 20) {
            return Promise.reject(new Error('비밀번호는는 8자 이상 20자 이하여야 합니다.'))
        }

        const regExp = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

        if (password !== PASSWORD_COVER_TEXT) {
            if (!regExp.test(password)) {
                return Promise.reject(new Error('비밀번호는 영어, 숫자, 특수문자를 모두 포함하여야 합니다.'))
            }
        }

        return Promise.resolve();
    }

    const validateConfirmPassword = (_: object, confirmPassword: string) => {

        if (!confirmPassword) {
            form.setFieldValue('confirmPassword', PASSWORD_COVER_TEXT);
            confirmPassword = form.getFieldValue('confirmPassword');
        }

        const password = form.getFieldValue('password');
        if (confirmPassword !== password) {
            return Promise.reject(new Error('비밀번호가 일치하지 않습니다.'))
        }
        return Promise.resolve();
    }

    const handleUpdateMember = (data: MemberInterface) => {

        if (!data.username || !data.password) {
            throw new Error('username and password cannot be null');
        }

        const dateOfBirth = dayjs(data.dateOfBirth).format('YYYY-MM-DD');

        if (data.fullName === member?.fullName 
            && data.gender === member?.gender 
            && dateOfBirth === String(member?.dateOfBirth) 
            && (data.password === PASSWORD_COVER_TEXT )) {
                message.error("수정사항을 입력하여 주세요.");
                setIsUpdateModalOpen(false);
                return false;
        }

        if (member) {
            const variables: MemberInterface = {id: member.id};
            if (data.fullName !== member.fullName) variables.fullName = data.fullName;
            if (data.gender !== member.gender) variables.gender = data.gender;
            if (dateOfBirth !== String(member.dateOfBirth)) variables.dateOfBirth = data.dateOfBirth;
            if (data.password !== PASSWORD_COVER_TEXT) variables.password = hashPassword(data.username || '', data.password || '');
            updateMember({variables: variables});
            client.cache.evict({ id: `Member:${member.id}` });
        }
    }

    const handleUpdateMemberFailed = (error: any) => {
        setIsUpdateModalOpen(false);
        handleFinishFailed(error);
    }

    const handleDelete = () => {
        deleteMember();
    }

    return (
        <>
            {member && (
                <div className={styles.member_update_form_container}>
                    <PageTitle title="회원정보" />
                    <div className={styles.member_update_form}>
                        <Form 
                            requiredMark={false} 
                            form={form} 
                            name="memberUpdateForm" 
                            layout="vertical" 
                            initialValues={worker} 
                            onFinish={handleUpdateMember} 
                            onFinishFailed={handleUpdateMemberFailed}
                        >
                            <Form.Item 
                                name="fullName" 
                                label="이름" 
                                rules={[
                                    {
                                        required: true,
                                        message: "이름은 필수입력 항목입니다."
                                    }
                                ]}
                                validateTrigger={['onBlur']}
                            >
                                <Input 
                                    placeholder="이름을 입력하여 주세요." 
                                    maxLength={10} 
                                />
                            </Form.Item>
                            <Form.Item
                                name="gender"
                                label="성별"
                                rules={[
                                    { 
                                        required: true, 
                                        message: '성별은 필수입력 항목입니다.' 
                                    }
                                ]}
                                validateTrigger={['onBlur']}
                            >
                                <Select
                                    placeholder="성별을 선택하여 주세요."
                                    options={[
                                        {value: "MALE", label: "남성"},
                                        {value: "FEMALE", label: "여성"},
                                        {value: "OTHER", label: "선택안함"},
                                    ]}
                                />
                            </Form.Item>
                            <Form.Item 
                                name="dateOfBirth" 
                                label="생년월일" 
                                rules={[
                                    {
                                        type: 'object' as const, 
                                        required: true, 
                                        message: '생년월일은 필수입력 항목입니다.'
                                    }
                                ]}
                            >
                                <DatePicker 
                                    placeholder="생년월일을 선택하여 주세요." 
                                    className={styles.date_picker}
                                />
                            </Form.Item>
                            <Form.Item
                                name="username"
                                label="아이디"
                                rules={[
                                    {
                                        required: true
                                    }
                                ]}
                            >
                                <Input
                                    readOnly
                                />
                            </Form.Item>
                            <Form.Item 
                                name="password" 
                                label="비밀번호" 
                                rules={[
                                    {
                                        validator: validatePassword,
                                    }
                                ]}
                                validateTrigger={['onBlur']}
                            >
                                <Input
                                    type="password"
                                    placeholder="비밀번호를 입력하여 주세요" 
                                    maxLength={20}
                                    onClick={() => {
                                        const password = form.getFieldValue('password');
                                        if (password === PASSWORD_COVER_TEXT) {
                                            form.setFieldValue('password', '');
                                        }
                                    }}
                                />
                            </Form.Item>
                            <Form.Item 
                                name="confirmPassword" 
                                label="비밀번호 확인" 
                                rules={[
                                    {
                                        validator: validateConfirmPassword,
                                    }
                                ]}
                                validateTrigger={['onBlur']}
                            >
                                <Input
                                    type="password"
                                    placeholder="비밀번호 확인을 입력하여 주세요" 
                                    maxLength={20}
                                    onClick={() => {
                                        const confirmPassword = form.getFieldValue('confirmPassword');
                                        if (confirmPassword === PASSWORD_COVER_TEXT) {
                                            form.setFieldValue('confirmPassword', '');
                                        }
                                    }}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button block size="large" type="primary" onClick={() => setIsUpdateModalOpen(true)}>회원정보 수정</Button>
                                <Modal 
                                    title="회원정보 수정"
                                    open={isUpdateModalOpen} 
                                    onOk={() => form.submit()} 
                                    onCancel={() => setIsUpdateModalOpen(false)} 
                                    okText="확인" 
                                    cancelText="취소"
                                >
                                    <Text>회원 정보를 수정하시겠습니까?</Text>
                                </Modal>
                                <Button block danger size="large" type="primary" onClick={() => setIsDeleteModalOpen(true)}>회원 탈퇴</Button>
                                <Modal
                                    title="회원 탈퇴"
                                    open={isDeleteModalOpen}
                                    onOk={handleDelete}
                                    onCancel={() => setIsDeleteModalOpen(false)}
                                    okText="확인"
                                    cancelText="취소"
                                >
                                    <Space direction="vertical">
                                        <Text>탈퇴 하시겠습니까?</Text>
                                        <Text>탈퇴 이후 계정 및 데이터 복구는 불가합니다.</Text>
                                    </Space>
                                </Modal>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            )}
        </>
    );
}

export default MemberUpdate;