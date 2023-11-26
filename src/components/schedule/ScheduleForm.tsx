import { useForm } from "antd/es/form/Form";
import { ScheduleFormInterface } from "../../interfaces/schedule/ScheduleFormInterface";
import { Button, Empty, Form, Input, Modal, Select, Table, Typography, message } from "antd";
import styles from "./ScheduleForm.module.scss"
import { useLazyQuery, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { LogInterface, ScheduleInterface, UnitInterface } from "../../interfaces/schedule/ScheduleInterface";
import PageTitle from "../pagetitle/PageTitle";
import { ColumnsType } from "antd/es/table";
import { addKeyToObject, getTodayAsString, handleFinishFailed, parseArrayToString } from "../../handlers/UtilityHandlers";
import { Link } from "react-router-dom";
import useURLParam from "../../hooks/useURLParam";
import { GET_UNIT, CREATE_UNIT, CREATE_SCHEDULE, UPDATE_SCHEDULE, DELETE_SCHEDULE, CREATE_LOG, UPDATE_LOG, DELETE_LOG } from "./ScheduleForm.queries";

const { Text } = Typography;

const emptyMockData: LogInterface[] = [
    {
        id: 0,
        value: 0,
        unit: {
            id: 0,
            name: ''
        }
    }
]

const emptyLog: LogInterface = { 
    id: 0,
    value: undefined,
    unit: {
        id: undefined,
        name: undefined
    }
};

const ScheduleForm: React.FC<ScheduleFormInterface> = ({ type, schedule: scheduleParam, parentId, title, refetch, onSubmitComplete }) => {

    const [form] = useForm();
    
    const date = useURLParam("date") || getTodayAsString();

    const [schedule, setSchedule] = useState<ScheduleInterface>();
    const [units, setUnits] = useState<UnitInterface[]>([]);
    const [scheduleData, setScheduleData] = useState<ScheduleInterface[]>([]);
    const [logData, setLogData] = useState<LogInterface[]>([]);
    const [logDisplayed, setLogDisplayed] = useState<LogInterface>(emptyLog);
    const [logOnUpdate, setLogOnUpdate] = useState<LogInterface>();
    const [isScheduleDeleteModalOpen, setIsScheduleDeleteModalOpen] = useState<boolean>(false);
    const [isLogDeleteModalOpen, setIsLogDeleteModalOpen] = useState<boolean>(false);

    const [getUnit] = useLazyQuery(GET_UNIT, {
        onCompleted: (data) => {
            if (data.unit) {
                addUnitData(data.unit);
            } else {
                const value = form.getFieldValue("scheduleFormUnit");
                createUnit({ variables: { unitName: value } });
            }
        }
    });

    const [createUnit] = useMutation(CREATE_UNIT, {
        onCompleted: (data) => {
            addUnitData(data.createUnit);
        }
    });

    const [createSchedule] = useMutation(CREATE_SCHEDULE, {
        onCompleted: () => {
            message.success('스케줄이 추가되었습니다.', 2)
            refetch && refetch();
            onSubmitComplete && onSubmitComplete();
            form.setFieldValue('scheduleFormName', '');
            form.setFieldValue('scheduleFormUnit', '');
            setUnits([]);
            setLogDisplayed(emptyLog);
            setLogOnUpdate(undefined);
        }
    });

    const [updateSchedule] = useMutation(UPDATE_SCHEDULE, {
        onCompleted: (data) => {
            if (schedule) {
                message.success('스케줄이 수정되었습니다.', 2)
                refetch && refetch();
                setSchedule({ ...schedule, name: data.updateSchedule.name, units: units });
            }
        }
    });

    const [deleteSchedule] = useMutation(DELETE_SCHEDULE, {
        onCompleted: () => {
            message.success('스케줄이 삭제되었습니다.', 2)
            refetch && refetch();
            onSubmitComplete && onSubmitComplete();
            form.setFieldValue('scheduleFormName', '');
            form.setFieldValue('scheduleFormUnit', '');
            setUnits([]);
            setLogDisplayed(emptyLog);
            setLogOnUpdate(undefined);
            setIsScheduleDeleteModalOpen(false);
        }
    });

    const [createLog] = useMutation(CREATE_LOG, {
        onCompleted: (data) => {
            message.success('로그가 추가되었습니다.', 2);
            setLogData([...logData, data.createLog]);
            refetch && refetch();
            setLogDisplayed(emptyLog);
            setLogOnUpdate(undefined);
        }
    });

    const [updateLog] = useMutation(UPDATE_LOG, {
        onCompleted: (data) => {
            message.success('로그가 수정되었습니다', 2);
            const updatedLog = data.updateLog;
            setLogData(logData.map((each: LogInterface) => {
                if (each.id === updatedLog.id) {
                    each = { ...each, value: updatedLog.value, unit: updatedLog.unit }
                }
                return each;
            }))
            refetch && refetch();
            setLogDisplayed(emptyLog);
            setLogOnUpdate(undefined);
        }
    });
    const [deleteLog] = useMutation(DELETE_LOG, {
        onCompleted: () => {
            message.success('로그가 삭제되었습니다.', 2);
            setLogData(logData.filter(each => each.id !== logDisplayed.id))
            refetch && refetch();
            setLogDisplayed(emptyLog);
            setLogOnUpdate(undefined);
            setIsLogDeleteModalOpen(false);
        }
    });

    useEffect(() => {
        scheduleParam && setSchedule(scheduleParam);
    }, [scheduleParam])

    useEffect(() => {
        form.setFieldValue('scheduleFormName', schedule?.name.substring(1));
        setUnits(schedule?.units ? addKeyToObject(schedule?.units) :  []);
        setScheduleData(schedule?.scheduleData ? addKeyToObject(schedule?.scheduleData) : []);
        setLogData(schedule?.logData ? addKeyToObject(schedule?.logData) : []);
        setLogDisplayed(emptyLog);
        setLogOnUpdate(undefined);
    }, [schedule])

    const addUnitData = (data: UnitInterface) => {
        if (units.some((unit) => unit.id === data.id)) {
            message.error('중복된 단위를 추가할 수 없습니다.', 2)
        } else {
            setUnits([...units, data]);
        }
        form.setFieldValue('scheduleFormUnit', '');
    }

    const handleCreateUnit = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        event.preventDefault();
        
        const value = form.getFieldValue("scheduleFormUnit");
        const regExp = /^[a-zA-Z0-9ㄱ-힣_"'\/\-`+=$!%~^&*()<>[\]{}?]+$/;

        if (!regExp.test(value) || !value) {
            return;
        }

        getUnit({ variables: { name: value } });
    }


    const handleCreateLog = () => {
        if (!Number.isInteger(logDisplayed.value)) {
            message.error('\'값\'은 필수입력 항목입니다.', 2);
            return;
        }

        if (!logDisplayed.unit.id) {
            message.error('\'단위\'은 필수입력 항목입니다.', 2);
            return;
        }

        createLog({
            variables: {
                value: logDisplayed.value,
                unit: logDisplayed.unit.id,
                schedule: schedule?.id
            } 
        })
    };

    const handleUpdateLog = () => {
        if (!Number.isInteger(logDisplayed.value)) {
            message.error('\'값\'은 필수입력 항목입니다.', 2);
            return;
        }

        if (!logDisplayed.unit.id) {
            message.error('\'단위\'은 필수입력 항목입니다.', 2);
            return;
        }

        updateLog({
            variables: {
                id: logDisplayed.id,
                value: logDisplayed.value,
                unit: logDisplayed.unit.id
            }
        })
    }

    const handleDeleteSchedule = () => {
        deleteSchedule({
            variables: { id: schedule?.id }
        })
    }

    const handleDeleteLog = () => {
        deleteLog({
            variables: {
                id: logDisplayed.id
            }
        })
    };

    const handleFinish = (values: ScheduleInterface) => {
        const valuesAsAny = values as any;
        if (type === 'create') {
                createSchedule({ 
                variables: {
                    scheduleName: `#${valuesAsAny.scheduleFormName}`,
                    units: units.length > 0 ? units.map(each => each.id) : null,
                    parent: parentId || null
                }
            })
        } else {
            let dataToUpdate: any = { scheduleId: schedule?.id };
            valuesAsAny.scheduleFormName !== schedule?.name ? dataToUpdate = {
                ...dataToUpdate,
                scheduleName: `#${valuesAsAny.scheduleFormName}`
            } : null;
            units !== schedule?.units ? dataToUpdate = {
                ...dataToUpdate,
                units: units.length > 0 ? units.map(each => each.id) : [] 
            } : null;
            updateSchedule({ variables: dataToUpdate })
        }
    }

    const scheduleTableColumns: ColumnsType<ScheduleInterface> = [
        {
            key: 'scheduleTableName',
            dataIndex: 'name',
            render: (value: string, record: ScheduleInterface) => {
                return (
                    <Link to={`/schedule/daily?${record.createdBy?.username ? `user=${record.createdBy?.username}&` : ''}date=${date}&scheduleId=${record.id}`}>
                        {value}
                    </Link>
                )
            }
        },
        {
            key: 'scheduleTableUnits',
            dataIndex: 'units',
            render: (value: UnitInterface[]) => <>{parseArrayToString(value, ['name'], ',')}</>
        }
    ]

    const logTableColumns: ColumnsType<LogInterface> = [
        {
            key: 'logTableValue',
            width: '50%',
            render: () => {
            return (
                <Input 
                    type="number" 
                    placeholder={"값을 입력해주세요."}
                    value={logDisplayed.value}
                    onChange={(event) => setLogDisplayed({...logDisplayed, value: Number(event.target.value)})}
                />)
            }
        },
        {
            key: 'logTableUnit',
            width: '40%',
            render: () => {
                return (
                    <Select
                        placeholder={"단위를 선택해주세요."}
                        value={logDisplayed.unit.id}
                        options={schedule?.units?.map((unit: UnitInterface) => {
                            return { value: unit.id, label: unit.name }
                        })}
                        onChange={(value, option) => {
                            const opt = option as any;
                            setLogDisplayed({...logDisplayed, unit: { id: value, name: opt.label }})
                        }}
                    />
                )
            }
        },
        {
            key: 'logTableButtons',
            width: '10%',
            render: () => {
                const logsEqual = (logOnUpdate?.id === logDisplayed.id) && (logOnUpdate.value === logDisplayed.value) && (logOnUpdate.unit.id === logDisplayed.unit.id);
                return (
                    <Button 
                        danger={logOnUpdate && logsEqual}
                        type={logOnUpdate ? "primary" : "default"}
                        onClick={logOnUpdate ? (logsEqual ? () => setIsLogDeleteModalOpen(true) : handleUpdateLog) : handleCreateLog}
                    >
                        {logOnUpdate ? (logsEqual ? "삭제" : "수정") : "생성"}
                    </Button>
                )
            }
        }
    ]

    return (
        <div className={styles.schedule_form_container}>
            <PageTitle title={type === 'create' ? (title ?? '') : (schedule?.name ?? '')} level={3} />
            <div className={styles.schedule_form}>
                <Form name="scheduleForm" form={form} layout="vertical" onFinish={handleFinish} onFinishFailed={handleFinishFailed}>
                    <Form.Item
                        name="scheduleFormName"
                        label="제목"
                        initialValue={type === 'update' && schedule ? schedule.name : ''}
                        rules={[
                            {
                                required: true,
                                message: "제목은 필수입력 항목입니다."
                            },
                            {
                                pattern: /^[a-zA-Z0-9ㄱ-힣_]+$/,
                                message: "제목은 한글, 영어, 숫자, 언더바('_')만 허용됩니다."
                            }
                        ]}
                        validateTrigger={["onBlur"]}
                    >
                        <Input 
                            maxLength={20}
                            placeholder="제출시 '#'이 자동으로 추가됩니다."
                        />
                    </Form.Item>
                    <Form.Item
                        name="scheduleFormUnit"
                        label="단위"
                        rules={[
                            {
                                pattern: /^[a-zA-Z0-9ㄱ-힣_"'\/\-`+=$!%~^&*()<>[\]{}?]+$/,
                                message: "단위는 한글, 영어, 숫자, 특수문자('_')만 허용됩니다."
                            }
                        ]}
                        validateTrigger={['onKeyDown']}
                    >
                        <Input
                            maxLength={10}
                            placeholder={"'Enter'키를 누르면 추가됩니다."}
                            onPressEnter={handleCreateUnit}
                            disabled={units.length >= 10}
                        />
                    </Form.Item>
                    <div className={styles.units_container}>
                        <div className={styles.units}>
                            {units.map((unit: UnitInterface) => {
                                return (
                                    <Button 
                                        key={`scheduleForm_unit${unit.id}`}
                                        type="dashed"
                                        onClick={() => setUnits(units.filter(each => each.name !== unit.name))}
                                    >
                                        {unit.name}
                                    </Button>
                                )
                            })}
                        </div>
                        {units.length > 0 && (
                            <div className={styles.message}>
                                <Text type="secondary">단위를 클릭하면 해당 단위가 삭제됩니다.</Text>
                            </div>
                        )}
                    </div>
                    {type === 'update' && (
                        <>
                            <Form.Item
                                name="scheduleFormScheduleData"
                                label="스케줄"
                            >
                                {schedule && schedule.depth === 5 ? (
                                    <Empty 
                                        description={
                                            <span className={styles.grey_text}>
                                                5뎁스 스케줄에는 스케줄을 작성할 수 없습니다.
                                            </span>
                                        }
                                    />
                                ) : (
                                    <Table
                                        columns={scheduleTableColumns}
                                        dataSource={scheduleData}
                                        pagination={false}
                                        showHeader={false}
                                        className={styles.table}
                                    />
                                )}
                            </Form.Item>
                            <Form.Item
                                name="scheduleFormLogData"
                                label="로그"
                            >
                                <Table
                                    className={styles.log_table}
                                    columns={logTableColumns}
                                    dataSource={emptyMockData}
                                    pagination={false}
                                    showHeader={false}
                                />
                                <div className={styles.units_container}>
                                    <div className={styles.units}>
                                        {logData.map((log: LogInterface) => {
                                            return (
                                                <Button 
                                                    key={`scheduleForm_log${log.id}`}
                                                    type={log === logOnUpdate ? "primary" : "dashed"}
                                                    onClick={() => {
                                                        setLogOnUpdate(log);
                                                        setLogDisplayed(log);
                                                    }}
                                                >
                                                    {log.value} {log.unit.name}
                                                </Button>
                                            )
                                        })}
                                        <Modal
                                            title="로그 삭제"
                                            open={isLogDeleteModalOpen}
                                            onOk={handleDeleteLog}
                                            onCancel={() => setIsLogDeleteModalOpen(false)}
                                            okText="확인"
                                            cancelText="취소"
                                        >
                                            <Text>로그를 삭제하시겠습니까?</Text>
                                        </Modal>
                                    </div>
                                </div>
                            </Form.Item>
                        </>
                    )}
                    <Form.Item className={styles.buttons_container}>
                        <Button block type="primary" htmlType="submit">{type === 'create' ? '추가' : '수정'}</Button>
                        {type === 'update' && (
                            <>
                                <Button block danger type="primary" onClick={() => setIsScheduleDeleteModalOpen(true)}>삭제</Button>
                                <Modal
                                    title="스케줄 삭제"
                                    open={isScheduleDeleteModalOpen}
                                    onOk={handleDeleteSchedule}
                                    onCancel={() => setIsScheduleDeleteModalOpen(false)}
                                    okText="확인"
                                    cancelText="취소"
                                >
                                    <Text>스케줄을 삭제하시겠습니까?</Text>
                                </Modal>
                            </>
                        )}
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default ScheduleForm;