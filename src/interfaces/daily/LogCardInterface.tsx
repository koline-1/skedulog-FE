import { LogInterface, ScheduleInterface } from "../schedule/ScheduleInterface";


export interface LogCardInterface {
    user: string;
    loggedInUser: string;
    date: string;
    today: string;
    formDisplayed: string;
    setFormDisplayed: Function;
    setScheduleOnUpdate: Function;
    logOnUpdate: LogInterface | undefined;
    setLogOnUpdate: Function;
    currentSchedule: ScheduleInterface;
    SUB_FORM_STATUS: {
        CREATE_SCHEDULE_TEXT: string,
        UPDATE_SCHEDULE_TEXT: string,
        CREATE_LOG_TEXT: string,
        UPDATE_LOG_TEXT: string
    };
}