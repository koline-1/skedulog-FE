import { MemberInterface } from "../member/MemberInterface";

export interface ScheduleInterface {
    id: number;
    name: string;
    depth?: number;
    units?: UnitInterface[];
    parent?: ScheduleInterface;
    scheduleData?: ScheduleInterface[];
    logData?: LogInterface[];
    createdBy?: MemberInterface;
    createdAt?: Date;
    updatedAt?: Date;
    key?: number;
}

export interface LogInterface {
    id: number;
    value?: number;
    unit: UnitInterface;
    schedule?: ScheduleInterface;
    createdBy?: MemberInterface;
    createdAt?: Date;
    updatedAt?: Date;
    key?: number;
}

export interface UnitInterface {
    id?: number;
    name?: string;
    schedules?: ScheduleInterface[];
    logs?: LogInterface[];
    key?: number;
}