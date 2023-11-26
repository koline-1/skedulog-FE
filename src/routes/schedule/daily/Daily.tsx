import { useEffect, useState } from "react";
import { Button, Layout } from "antd";
import PageTitle from "../../../components/pagetitle/PageTitle";
import styles from "./Daily.module.scss";
import { ScheduleInterface } from "../../../interfaces/schedule/ScheduleInterface";
import { getUsername } from "../../../cookie/Cookie";
import { getTodayAsString } from "../../../handlers/UtilityHandlers";
import ScheduleSider from "../../../components/sider/ScheduleSider";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday"
import localeData from "dayjs/plugin/localeData"
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import Error from "../../../components/error/Error";
import useURLParam from "../../../hooks/useURLParam";
import DailyCard from "../../../components/daily/card/DailyCard";

dayjs.extend(weekday)
dayjs.extend(localeData)

const { Content } = Layout;

/**
 * 파라미터로 전달된 사용자의 스케줄과 해당 날짜의 로그
 * 존재하지 않는 아이디: 에러페이지
 * !사용자: 로그인된 사용자
 * !날짜: 접속 당일 로그
 * @returns user ? user의 Daily 스케줄로그 : 에러페이지
 */
const Daily: React.FC = () => {

    const [siderCollapsed, setSiderCollapsed] = useState<boolean>(false);
    const [isMemberNotFound, setIsMemberNotFound] = useState<boolean>(false);
    const [position, setPosition] = useState<number>(0);
    const [scrollAt, setScrollAt] = useState<number>(0);
    const [documentHeight, setDocumentHeight] = useState<number>(0);

    const today = getTodayAsString();
    const dateParam = useURLParam("date");
    const [date, setDate] = useState<string>(today);
    const loggedInUser = getUsername();
    const userParam = useURLParam("user");
    const [user, setUser] = useState<string>('');
    const scheduleId = useURLParam("scheduleId");

    const [currentSchedule, setCurrentSchedule] = useState<ScheduleInterface>();
    const [schedules, setSchedules] = useState<ScheduleInterface[]>([]);
    const [formDisplayed, setFormDisplayed] = useState<string>('');

    useEffect(() => {
        dateParam ? setDate(dateParam) : setDate(today);
    }, [dateParam])

    useEffect(() => {
        userParam ? setUser(userParam) : setUser(loggedInUser);
    }, [userParam])

    useEffect(() => {
        window.addEventListener("scroll", () => setScrollAt(scrollY))
    }, [])
    
    useEffect(() => {
        setPosition(documentHeight - scrollAt - window.innerHeight)
    }, [scrollAt, documentHeight])

    useEffect(() => {
        setDocumentHeight(document.body.scrollHeight)
    }, [document.body.scrollHeight, formDisplayed])

    return (
        <>
            {isMemberNotFound ? (
                <Error 
                    status="404"
                    title="존재하지 않거나 비공개된 회원입니다."
                    subTitle="회원의 스케줄로그를 확인할 수 없습니다." 
                />
            ) : (
                <Layout className={styles.layout}>
                    <ScheduleSider 
                        createdAt={date} 
                        createdBy={currentSchedule?.createdBy?.username || user} 
                        collapsed={siderCollapsed} 
                        scheduleId={scheduleId || ''}
                        position={position}
                        onEmpty={() => setFormDisplayed('create_schedule')}
                    />
                    <Button
                        type="text"
                        icon={siderCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setSiderCollapsed(!siderCollapsed)}
                        className={`${styles.sider_collapse_button} ${styles.collapse_button_fixed} ${siderCollapsed ? styles.collapse_button_slide_out : styles.collapse_button_slide_in}`}
                    />
                    <Content className={styles.layout_content}>
                        <div className={styles.schedule_daily_container}>
                            <PageTitle title={`${date === today ? '오늘' : date}의 로그`} className={siderCollapsed ? styles.sider_slide_out : styles.sider_slide_in} />
                            <DailyCard 
                                className={siderCollapsed ? styles.sider_slide_out : styles.sider_slide_in}
                                date={date}
                                user={user}
                                currentSchedule={currentSchedule}
                                setCurrentSchedule={setCurrentSchedule}
                                scheduleId={scheduleId}
                                schedules={schedules}
                                setSchedules={setSchedules}
                                formDisplayed={formDisplayed}
                                setFormDisplayed={setFormDisplayed}
                                setIsMemberNotFound={setIsMemberNotFound}
                            />
                        </div>
                    </Content>
                </Layout>
            )}
        </>
    );
}

export default Daily;