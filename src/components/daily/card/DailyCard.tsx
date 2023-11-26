import { Breadcrumb, Button, Card, DatePicker, Input, Tooltip, Typography, message } from "antd";
import { FormOutlined } from "@ant-design/icons"
import styles from "./DailyCard.module.scss";
import { DailyCardInterface } from "../../../interfaces/daily/DailyCardInterface";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday"
import localeData from "dayjs/plugin/localeData"
import { addKeyToObject, getTodayAsString } from "../../../handlers/UtilityHandlers";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogInterface, ScheduleInterface } from "../../../interfaces/schedule/ScheduleInterface.tsx";
import { getUsername } from "../../../cookie/Cookie";
import { CSSTransition } from "react-transition-group";
import ScheduleForm from "../../schedule/ScheduleForm";
import LogForm from "../../log/LogForm";
import { ApolloError, useLazyQuery, useMutation } from "@apollo/client";
import { 
    GET_SCHEDULE,
    GET_TOP_LEVEL_SCHEDULES,
    UPDATE_SCHEDULE,
} from "./DailyCard.queries.tsx";
import { GraphQLErrorInterface } from "../../../interfaces/error/GraphQLErrorInterface.tsx";
import useDocumentTitle from "../../../hooks/useDocumentTitle.tsx";
import DailyTable from "../table/DailyTable.tsx";
import UnitCard from "./UnitCard.tsx";
import LogCard from "./LogCard.tsx";

dayjs.extend(weekday)
dayjs.extend(localeData)

const { Title, Text } = Typography;

const SUB_FORM_STATUS = {
    CREATE_SCHEDULE_TEXT: 'create_schedule',
    UPDATE_SCHEDULE_TEXT: 'update_schedule',
    CREATE_LOG_TEXT: 'create_log',
    UPDATE_LOG_TEXT: 'update_log',
};

const SLIDE_CLASSES = {
    enterActive: styles.slide_transition_enter_active,
    enterDone: styles.slide_transition_enter_done,
    exitActive: styles.slide_transition_exit_active,
    exitDone: styles.slide_transition_exit_done
};

const DATE_FORMAT = 'YYYY-MM-DD';

/**
 * Daily 컴포넌트 뷰
 * @param {string} className 클래스명
 * @param {Schedule} currentSchedule 조회할 스케줄
 * @param {Function} setSchedule 조회할 스케줄 설정
 * @param {string} date 조회할 스케줄 날짜
 * @param {string} user 조회할 사용자 아이디
 * @param {string} scheduleId 조회할 스케줄 아이디
 * @param {Schedule[]} schedules 조회할 스케줄 하위 스케줄
 * @param {Function} setSchedules 조회할 스케줄 하위 스케줄 설정
 * @param {string} formDisplayed 표시된 subForm
 * @param {Function} setFormDisplayed 표시된 subForm 설정
 * @param {Function} setIsMemberNotFound 회원 존재 여부
 * @returns {ReactNode} Daily 컴포넌트
 */
const DailyCard: React.FC<DailyCardInterface> = ({
    className,
    currentSchedule,
    setCurrentSchedule,
    date,
    user,
    scheduleId,
    schedules,
    setSchedules,
    formDisplayed,
    setFormDisplayed,
    setIsMemberNotFound,
}) => {

    const { setTitle } = useDocumentTitle();
    const navigate = useNavigate();

    const today = getTodayAsString();
    const loggedInUser = getUsername();

    const [scheduleOnUpdate, setScheduleOnUpdate] = useState<ScheduleInterface>();
    const [logOnUpdate, setLogOnUpdate] = useState<LogInterface>();
    const [isCreatingUnit, setIsCreatingUnit] = useState<boolean>(false);
    const [unitDisplayed, setUnitDisplayed] = useState<string>('');
    const [isEditingScheduleName, setIsEditingScheduleName] = useState<boolean>(false);

    useEffect(() => {
        removeSubFormData();
        (user && date) && getScheduleData({
            variables: {
                id: Number(scheduleId),
                createdBy: user,
                createdAt: date
            }
        });
        !scheduleId && setCurrentSchedule(undefined);
        user && setTitle(`${date === today ? '오늘' : date}의 로그 | ${user}`);
    }, [user, date, scheduleId])

    const [updateSchedule] = useMutation(UPDATE_SCHEDULE, {
        onCompleted: () => {
            isCreatingUnit ? message.success('단위가 추가되었습니다.', 2) : message.success('단위가 삭제되었습니다.', 2);
            setIsCreatingUnit(false);
            setUnitDisplayed('');
            refetch();
        }
    });

    const [updateScheduleName] = useMutation(UPDATE_SCHEDULE, {
        onCompleted: () => {
            message.success('스케줄 제목이 수정되었습니다.', 2);
            setIsEditingScheduleName(false);
            refetch();
        }
    })

    const [getScheduleData, { data: scheduleData, refetch }] = useLazyQuery(scheduleId ? GET_SCHEDULE : GET_TOP_LEVEL_SCHEDULES, {
        onError: (error: ApolloError) => { 
            const gqlError = (error.graphQLErrors[0] as unknown) as GraphQLErrorInterface;
            const code = gqlError.extensions.http.code;
            
            code === "MEMBER_NOT_FOUND" && setIsMemberNotFound(true);
        },
        onCompleted: (data) => {
            data.schedule && setCurrentSchedule(data.schedule);
            const scheduleData = scheduleId ? data.schedule.scheduleData : data.allSchedulesByMember
            addKeyToObject(scheduleData);
            setSchedules(scheduleData);
        }
    });

    const getRoute: Function = (current: ScheduleInterface, route: { title : string | React.ReactNode }[]) => {
        route.push({ 
            title:  current.id === Number(scheduleId) ? current.name : (
                <Link 
                    to={`/schedule/daily?user=${currentSchedule ? currentSchedule?.createdBy?.username : user}&date=${date}&scheduleId=${current.id}`}
                >
                    {current.name}
                </Link>
            )
        });
        if (current.parent) {
            getRoute(current.parent, route);
        }
        return route;
    }

    const flipRoute = (route: { title : string | React.ReactNode }[]) => {
        const result: { title : string | React.ReactNode }[] = [
            { 
                title: (
                    <Link 
                        onClick={() => setCurrentSchedule(undefined)} 
                        to={`/schedule/daily?user=${currentSchedule ? currentSchedule?.createdBy?.username : user}&date=${date}`}
                    >
                        Home
                    </Link> 
                )
            }
        ];
        result.push(...route.reverse());
        return result;
    }

    const removeSubFormData = () => {
        setFormDisplayed('');
        setScheduleOnUpdate(undefined);
        setLogOnUpdate(undefined);
    }

    const handleUpdateTitle = (event: React.KeyboardEvent) => {
        const value = (event.target as any).value;

        if (value.length === 0) return;
        else if (value.length > 20) {
            message.error('스케줄의 제목은 20자 이하여야 합니다.', 2);
            return;
        }
        
        const regExp = /^[a-zA-Z0-9ㄱ-힣_]+$/;
        !regExp.test(value) && message.error('제목은 한글, 영어, 숫자, 언더바(\'_\')만 허용됩니다.', 2);

        updateScheduleName({ variables : { id: currentSchedule?.id, name: '#'+value } });
    }

    return (
        <Card 
            className={`${styles.daily_card} ${className}`}
            title={(
                <Title level={3}>
                    <Text underline className={styles.card_title_username}>{'@' + (currentSchedule ? currentSchedule?.createdBy?.username : user)}</Text>님의 스케줄로그
                </Title>
            )}
            extra={
                <DatePicker 
                    value={dayjs(date, DATE_FORMAT)} 
                    format={DATE_FORMAT} 
                    onChange={(_, dateString) => {
                        const tmpUsername = currentSchedule ? currentSchedule.createdBy?.username : user
                        const tmpScheduleId = currentSchedule ? currentSchedule.id : undefined
                        navigate(`/schedule/daily?user=${tmpUsername}&date=${dateString}${tmpScheduleId ? `&scheduleId=${currentSchedule?.id}` : ''}`)
                    }} 
                />
            }
        >
            {isEditingScheduleName ? (
                <Title level={3}>#
                    <Tooltip title="Enter를 누르면 제목이 수정됩니다." trigger={['focus']} color="blue" placement="topLeft">
                        <Input
                            autoFocus
                            maxLength={20}
                            className={styles.edit_input}
                            onBlur={() => setIsEditingScheduleName(false)} 
                            placeholder="제목을 입력하여 주세요."
                            defaultValue={currentSchedule?.name.substring(1) || ''}
                            onPressEnter={handleUpdateTitle}
                        />
                    </Tooltip>
                </Title>
            ) : (
                <>
                    {currentSchedule && (
                        <Title level={3}>
                            {currentSchedule?.name || ''}<FormOutlined className={styles.edit_icon} onClick={() => setIsEditingScheduleName(true)} />
                        </Title>
                    )}
                </>
            )}
            <Breadcrumb items={currentSchedule ? flipRoute(getRoute(currentSchedule, [])) : []} />
            {currentSchedule && (
                <div className={styles.unit_log_container}>
                    <UnitCard 
                        user={user}
                        loggedInUser={loggedInUser}
                        date={date}
                        today={today}
                        isCreatingUnit={isCreatingUnit}
                        setIsCreatingUnit={setIsCreatingUnit}
                        unitDisplayed={unitDisplayed}
                        setUnitDisplayed={setUnitDisplayed}
                        currentSchedule={currentSchedule}
                        updateSchedule={updateSchedule}
                    />
                    <LogCard
                        user={user}
                        loggedInUser={loggedInUser}
                        date={date}
                        today={today}
                        formDisplayed={formDisplayed}
                        setFormDisplayed={setFormDisplayed}
                        setScheduleOnUpdate={setScheduleOnUpdate}
                        logOnUpdate={logOnUpdate}
                        setLogOnUpdate={setLogOnUpdate}
                        currentSchedule={currentSchedule}
                        SUB_FORM_STATUS={SUB_FORM_STATUS}
                    />
                </div>
            )}
            {(!currentSchedule || (currentSchedule && currentSchedule.depth !== 5)) && (
                <DailyTable
                    user={user}
                    date={date}
                    today={today}
                    formDisplayed={formDisplayed}
                    setFormDisplayed={setFormDisplayed}
                    scheduleOnUpdate={scheduleOnUpdate}
                    setScheduleOnUpdate={setScheduleOnUpdate}
                    setLogOnUpdate={setLogOnUpdate}
                    currentSchedule={currentSchedule}
                    loggedInUser={loggedInUser}
                    schedules={schedules}
                    SUB_FORM_STATUS={SUB_FORM_STATUS}
                />
            )}
            <div className={styles.buttons_container}>
                {currentSchedule && (
                    <>
                        <Button
                            size="large"
                            type="default"
                            onClick={() => {
                                if (!currentSchedule.parent) setCurrentSchedule(undefined);
                                navigate(`/schedule/daily?user=${currentSchedule ? currentSchedule?.createdBy?.username : user}`
                                    + `&date=${date}${scheduleData.schedule.parent ? `&scheduleId=${scheduleData.schedule.parent.id}` : ''}`)
                            }}
                        >
                            뒤로
                        </Button>
                    </>
                )}
                {(user === loggedInUser && date === today && (!currentSchedule || (currentSchedule && currentSchedule.depth !== 5))) && (
                    <Button
                        size="large"
                        type="primary"
                        onClick={() => {
                            const onButtonClick = () => {
                                setScheduleOnUpdate(undefined);
                                setLogOnUpdate(undefined);
                                setFormDisplayed(SUB_FORM_STATUS.CREATE_SCHEDULE_TEXT);
                            }
                            formDisplayed === SUB_FORM_STATUS.CREATE_SCHEDULE_TEXT ? setFormDisplayed('') : onButtonClick()
                        }}
                    >
                        {formDisplayed === SUB_FORM_STATUS.CREATE_SCHEDULE_TEXT ? '닫기' : '스케줄 추가'}
                    </Button>
                )}
            </div>
            <div className={styles.sub_form_container}>
                <CSSTransition
                    in={formDisplayed === SUB_FORM_STATUS.CREATE_SCHEDULE_TEXT}
                    timeout={0}
                    classNames={SLIDE_CLASSES}
                    unmountOnExit
                >
                    <ScheduleForm 
                        title="스케줄 추가" 
                        type="create" 
                        parentId={Number(scheduleId)}
                        onSubmitComplete={removeSubFormData}
                        refetch={refetch}
                    />
                </CSSTransition>
                <CSSTransition
                    in={formDisplayed === SUB_FORM_STATUS.UPDATE_SCHEDULE_TEXT}
                    timeout={0}
                    classNames={SLIDE_CLASSES}
                    unmountOnExit
                >
                    <ScheduleForm 
                        type="update" 
                        schedule={scheduleOnUpdate} 
                        parentId={Number(scheduleId)}
                        onSubmitComplete={removeSubFormData}
                        refetch={refetch}
                    />
                </CSSTransition>
                {currentSchedule && (
                    <>
                        <CSSTransition
                            in={formDisplayed === SUB_FORM_STATUS.CREATE_LOG_TEXT}
                            timeout={0}
                            classNames={SLIDE_CLASSES}
                            unmountOnExit
                        >
                            <LogForm 
                                type="create"
                                schedule={currentSchedule}
                                onSubmitComplete={removeSubFormData}
                                refetch={refetch}
                            />
                        </CSSTransition>
                        <CSSTransition
                            in={formDisplayed === SUB_FORM_STATUS.UPDATE_LOG_TEXT}
                            timeout={0}
                            classNames={SLIDE_CLASSES}
                            unmountOnExit
                        >
                            <LogForm 
                                type="update"
                                schedule={currentSchedule}
                                log={logOnUpdate}
                                onSubmitComplete={removeSubFormData}
                                refetch={refetch}
                            />
                        </CSSTransition>
                    </>
                )}
            </div>
        </Card>
    )
}

export default DailyCard