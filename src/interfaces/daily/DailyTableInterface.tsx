import { ScheduleInterface } from "../schedule/ScheduleInterface";


export interface DailyTableInterface {
    user: string;
    date: string;
    today: string;
    formDisplayed: string;
    setFormDisplayed: Function;
    scheduleOnUpdate?: ScheduleInterface;
    setScheduleOnUpdate: Function;
    setLogOnUpdate: Function;
    currentSchedule?: ScheduleInterface;
    loggedInUser: string;
    schedules: ScheduleInterface[] | [];
    SUB_FORM_STATUS: {
        CREATE_SCHEDULE_TEXT: string,
        UPDATE_SCHEDULE_TEXT: string,
        CREATE_LOG_TEXT: string,
        UPDATE_LOG_TEXT: string
    }
}