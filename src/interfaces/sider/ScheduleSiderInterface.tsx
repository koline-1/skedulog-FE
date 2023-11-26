import { MouseEventHandler } from "react";

export interface ScheduleSiderInterface {
    createdBy: string;
    createdAt: string;
    collapsed: boolean;
    scheduleId?: string;
    position: number;
    onEmpty?: MouseEventHandler;
}