import { ScheduleInterface } from "./ScheduleInterface";

export interface ScheduleFormInterface {
    type?: string;
    parentId?: number;
    schedule?: ScheduleInterface;
    title?: string;
    onSubmitComplete?: Function;
    refetch?: Function; 
}