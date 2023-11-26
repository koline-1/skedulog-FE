import { Card, Button, Empty, message } from "antd";
import { LogCardInterface } from "../../../interfaces/daily/LogCardInterface";
import { LogInterface } from "../../../interfaces/schedule/ScheduleInterface";
import styles from "./LogCard.module.scss"

/**
 * LogCard 컴포넌트 뷰
 * @param {string} user 사용자아이디
 * @param {string} loggedInUser 로그인된 사용자 아이디
 * @param {string} date 조회할 스케줄 날짜
 * @param {string} today 현재 날짜
 * @param {string} formDisplayed 표시중인 폼
 * @param {Function} setFormDisplayed 표시중인 폼 설정
 * @param {Function} setScheduleOnUpdate 수정중인 스케줄 설정
 * @param {LogInterface} logOnUpdate 수정중인 로그
 * @param {Function} setLogOnUpdate 수정중인 로그 설정
 * @param {ScheduleInterface} currentSchedule 조회중인 스케줄
 * @param {object} SUB_FORM_STATUS 폼 string 객체
 * @returns LogCard 컴포넌트
 */
const LogCard: React.FC<LogCardInterface> = ({
    user,
    loggedInUser,
    date,
    today,
    formDisplayed,
    setFormDisplayed,
    setScheduleOnUpdate,
    logOnUpdate,
    setLogOnUpdate,
    currentSchedule,
    SUB_FORM_STATUS
}) => {

    const handleNotice = () => {
        if (user === loggedInUser && date !== today) {
            message.warning("로그 수정은 오늘의 로그 페이지에서만 가능합니다.", 2);
        }
    }

    return (
        <Card 
            type="inner" 
            title="로그" 
            className={styles.card} 
            extra={(user === loggedInUser && date === today) && (
                <Button
                    type="primary"
                    onClick={() => {
                        const openLogCreateForm = () => {
                            setFormDisplayed(SUB_FORM_STATUS.CREATE_LOG_TEXT);
                        }

                        const closeLogCreateForm = () => {
                            setFormDisplayed('');
                        }

                        setScheduleOnUpdate(undefined);
                        setLogOnUpdate(undefined);
                        formDisplayed === SUB_FORM_STATUS.CREATE_LOG_TEXT ? closeLogCreateForm() : openLogCreateForm();
                    }}
                >
                    {formDisplayed === SUB_FORM_STATUS.CREATE_LOG_TEXT ? '닫기' : '로그 추가'}
                </Button>
            )}
        >
            {currentSchedule.logData?.length ? currentSchedule.logData.map((log: LogInterface) => {
                return (user === loggedInUser && date === today) ? (
                    <Button
                        key={`log${log.id}`}
                        size="large"
                        type={formDisplayed === SUB_FORM_STATUS.UPDATE_LOG_TEXT && logOnUpdate?.id === log.id ? "primary" : "dashed"}
                        onClick={() => {
                            const openLogUpdateForm = () => {
                                setLogOnUpdate(log);
                                setFormDisplayed(SUB_FORM_STATUS.UPDATE_LOG_TEXT);
                            }

                            const closeLogUpdateForm = () => {
                                setLogOnUpdate(undefined);
                                setFormDisplayed('');
                            }

                            setScheduleOnUpdate(undefined);
                            formDisplayed === SUB_FORM_STATUS.UPDATE_LOG_TEXT && logOnUpdate?.id === log.id ? closeLogUpdateForm() : openLogUpdateForm();
                        }}
                    >
                        {log.value} {log.unit.name}
                    </Button>
                ) : (
                    <Button key={`log${log.id}`} size="large" type="dashed" onClick={handleNotice}>{log.value} {log.unit.name}</Button>
                )
            }) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        </Card>
    )
}

export default LogCard;