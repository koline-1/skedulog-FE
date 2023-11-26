import { Button, Table, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import { Link } from "react-router-dom";
import { parseArrayToString } from "../../../handlers/UtilityHandlers";
import { LogInterface, ScheduleInterface, UnitInterface } from "../../../interfaces/schedule/ScheduleInterface";
import styles from "./DailyTable.module.scss";
import { DailyTableInterface } from "../../../interfaces/daily/DailyTableInterface";

const { Text } = Typography;

const DailyTable: React.FC<DailyTableInterface> = ({
    user,
    date,
    today,
    formDisplayed,
    setFormDisplayed,
    scheduleOnUpdate,
    setScheduleOnUpdate,
    setLogOnUpdate,
    currentSchedule,
    loggedInUser,
    schedules,
    SUB_FORM_STATUS
}) => {

    const columns: ColumnsType<ScheduleInterface> = [
        {
            key: 'scheduleListName',
            title: '스케줄',
            dataIndex: 'name',
            width: '13%',
            render: (value: String, record: ScheduleInterface) => {
                return (
                    <Link to={`/schedule/daily?user=${user}&date=${date}&scheduleId=${record.id}`}>
                        <Text ellipsis={true} style={{width:'8vw', color:'#1677ff'}}>
                            {value}
                        </Text>
                    </Link>
                )
            }
        },
        {
            key: 'scheduleListUnit',
            title: '단위',
            dataIndex: 'units',
            width: '12%',
            render: (value: UnitInterface[]) => {
                return (
                    <Text className={value.length ? undefined : styles.grey_text} ellipsis={true} style={{width:'6vw'}}>
                        {value.length ? parseArrayToString(value, ['name'], ',') : "등록된 단위가 없습니다."}
                    </Text>
                );
            }
        },
        {
            key: 'scheduleListScheduleData',
            title: '하위 스케줄',
            dataIndex: 'scheduleData',
            width: '33%',
            render: (value: ScheduleInterface[]) => {
                return currentSchedule?.depth === 4 ? (
                    <Text className={styles.grey_text} ellipsis={true} style={{width:'20vw'}}>
                        5뎁스 스케줄에는 스케줄을 작성할 수 없습니다.
                    </Text>
                ) : (
                    <Text className={value.length ? undefined : styles.grey_text} ellipsis={true} style={{width:'20vw'}}>
                        {value.length ? parseArrayToString(value, ['name'], ',') : "등록된 스케줄이 없습니다."}
                    </Text>
                );
            }
        },
        {
            key: 'scheduleListLogData',
            title: '하위 로그',
            dataIndex: 'logData',
            width: '33%',
            render: (value: LogInterface[]) => {
                return (
                    <Text className={value.length ? undefined : styles.grey_text} ellipsis={true} style={{width:'20vw'}}>
                        {value.length ? parseArrayToString(value, ['value', 'unit.name'], ',', ' ') : "등록된 로그가 없습니다."}
                    </Text>
                );
            }
        },
        {
            key: 'updateButton',
            title: '상세정보',
            width: '9%',
            render: (_, record: ScheduleInterface) => {
                return (user === loggedInUser && date === today) ? (
                    <Button 
                        type={formDisplayed === SUB_FORM_STATUS.UPDATE_SCHEDULE_TEXT && record.id === scheduleOnUpdate?.id ? 'primary' : 'default'}
                        onClick={() => {
                            const openScheduleUpdateForm = () => {
                                setScheduleOnUpdate(record);
                                setFormDisplayed(SUB_FORM_STATUS.UPDATE_SCHEDULE_TEXT);
                            }

                            const closeScheduleUpdateForm = () => {
                                setScheduleOnUpdate(record.id === scheduleOnUpdate?.id ? undefined : record);
                                setFormDisplayed('');
                            }
                            
                            formDisplayed === SUB_FORM_STATUS.UPDATE_SCHEDULE_TEXT && record.id === scheduleOnUpdate?.id ? closeScheduleUpdateForm() : openScheduleUpdateForm();
                            setLogOnUpdate(undefined);
                        }}
                    >
                        {record.id === scheduleOnUpdate?.id ? '닫기' : '보기'}
                    </Button>
                ) : (
                    <Button disabled>보기</Button>
                )
            }
        }
    ]


    return (
        <Table 
            rowKey={(render) => `schedule${render.id}`}
            columns={columns} 
            dataSource={schedules || undefined} 
            pagination={false} 
            showHeader={true} 
            className={styles.schedule_daily_table} 
        />
    )
}

export default DailyTable;