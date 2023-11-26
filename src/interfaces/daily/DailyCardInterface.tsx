import { ScheduleInterface } from "../schedule/ScheduleInterface";

/**
 * DailyCard 컴포넌트 interface
 */
export interface DailyCardInterface {
    className?: string;
    currentSchedule?: ScheduleInterface;
    setCurrentSchedule: Function;
    date: string;
    user: string;
    scheduleId: string;
    schedules: ScheduleInterface[] | [];
    setSchedules: Function;
    formDisplayed: string;
    setFormDisplayed: Function;
    setIsMemberNotFound: Function;
}