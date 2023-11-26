import { LogInterface, ScheduleInterface } from "../schedule/ScheduleInterface";

export interface LogFormInterface {
    type: string;
    title?: string;
    schedule: ScheduleInterface;
    log?: LogInterface;
    onSubmitComplete?: Function;
    refetch?: Function;
}