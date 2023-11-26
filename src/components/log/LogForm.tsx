import { useEffect, useState } from "react";
import { useForm } from "antd/es/form/Form";
import { LogFormInterface } from "../../interfaces/log/LogFormInterface"
import PageTitle from "../pagetitle/PageTitle";
import styles from "./LogForm.module.scss";
import { Button, Form, Input, Modal, Select, message, Typography } from "antd";
import { LogInterface, UnitInterface } from "../../interfaces/schedule/ScheduleInterface";
import { useMutation } from "@apollo/client";
import { handleFinishFailed } from "../../handlers/UtilityHandlers";
import { CREATE_LOG, UPDATE_LOG, DELETE_LOG } from "./LogForm.queries";

const { Text } = Typography;

const LogForm: React.FC<LogFormInterface> = ({ type, title, schedule, log: logParam, onSubmitComplete, refetch }) => {
    
    const [form] = useForm();
    const [log, setLog] = useState<LogInterface>();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

    const [createLog] = useMutation(CREATE_LOG, {
        onCompleted: () => {
            message.success('로그가 추가되었습니다.');
            onSubmitComplete ? onSubmitComplete() : null;
            refetch && refetch();
            form.setFieldValue('logFormLogValue', '');
            form.setFieldValue('logFormUnit', '');
        }
    });
    const [updateLog] = useMutation(UPDATE_LOG, {
        onCompleted: () => {
            message.success('로그가 수정되었습니다.');
            refetch && refetch();
        }
    });
    const [deleteLog] = useMutation(DELETE_LOG, {
        onCompleted: () => {
            message.success('로그가 삭제되었습니다.');
            onSubmitComplete ? onSubmitComplete() : null;
            refetch && refetch();
            setIsDeleteModalOpen(false);
        }
    });

    useEffect(() => {
        logParam && setLog(logParam);
    }, [logParam])

    useEffect(() => {
        if (log) {
            form.setFieldValue('logFormLogValue', log.value);
            form.setFieldValue('logFormUnit', log.unit.id);
        }
    }, [log])

    const handleDeleteLog = () => {
        deleteLog({ variables: { id: log?.id } });
    }

    const handleFinish = (values: LogInterface) => {
        const valuesAsAny = values as any;
        if (type === "create") {
            createLog({
                variables: {
                    value: Number(valuesAsAny.logFormLogValue) as LogInterface["value"],
                    unit: valuesAsAny.logFormUnit as LogInterface["unit"],
                    schedule: schedule.id
                }
            })
        } else {
            const dataToUpdate: any = { id: log?.id };
            valuesAsAny.logFormLogValue === log?.value ? null : dataToUpdate.value = Number(valuesAsAny.logFormLogValue);
            valuesAsAny.logFormUnit === log?.unit.id ? null : dataToUpdate.unit = Number(valuesAsAny.logFormUnit);
            if (!dataToUpdate.value && !dataToUpdate.unit) {
                message.error('수정사항을 입력하여 주세요.', 2);
                return;
            }
            updateLog({
                variables: dataToUpdate
            })
        }
    }
    
    return (
        <div className={styles.log_form_container}>
            <PageTitle level={3} title={type === "create" ? (title ?? '로그 추가') : (title ?? '로그 수정')} />
            <div className={styles.log_form}>
                <Form name="logForm" form={form} layout="vertical" onFinish={handleFinish} onFinishFailed={handleFinishFailed}>
                    <Form.Item
                        name="logFormScheduleName"
                        label="스케줄"
                    >
                        <Input 
                            readOnly
                            defaultValue={schedule.name}
                        />
                    </Form.Item>
                    <Form.Item
                        name="logFormLogValue"
                        label="값"
                        initialValue={type === "update" && log ? log.value : null}
                        rules={[
                            {
                                required: true,
                                message: "값은 필수입력 항목입니다."
                            }
                        ]}
                        validateTrigger={["onBlur"]}
                    >
                        <Input
                            placeholder="값을 입력하여 주세요"
                            type="number"
                        />
                    </Form.Item>
                    <Form.Item
                        name="logFormUnit"
                        label="단위"
                        initialValue={type === "update" && log ? log.unit.id : null}
                        rules={[
                            {
                                required: true,
                                message: "단위는 필수입력 항목입니다."
                            }
                        ]}
                    >
                        <Select
                            placeholder="단위를 선택하여 주세요."
                            options={ schedule.units ? (
                                schedule.units.map((each: UnitInterface) => { 
                                    return { label: each.name, value: each.id }
                                })
                            ) : []}
                        />
                    </Form.Item>
                    <Form.Item className={styles.buttons_container}>
                        <Button block type="primary" htmlType="submit">{type === "create" ? "추가" : "수정"}</Button>
                        {type === 'update' && (
                            <>
                                <Button block danger type="primary" onClick={() => setIsDeleteModalOpen(true)}>삭제</Button>
                                <Modal
                                    title="로그 삭제"
                                    open={isDeleteModalOpen}
                                    onOk={handleDeleteLog}
                                    onCancel={() => setIsDeleteModalOpen(false)}
                                    okText="확인"
                                    cancelText="취소"
                                >
                                    <Text>로그를 삭제하시겠습니까?</Text>
                                </Modal>
                            </>
                        )}
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

export default LogForm