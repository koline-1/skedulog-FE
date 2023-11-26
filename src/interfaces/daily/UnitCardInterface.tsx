import { ScheduleInterface } from "../schedule/ScheduleInterface";

export interface UnitCardInterface {
    user: string;
    loggedInUser: string;
    date: string;
    today: string;
    isCreatingUnit: boolean;
    setIsCreatingUnit: Function;
    unitDisplayed: string;
    setUnitDisplayed: Function;
    currentSchedule: ScheduleInterface;
    updateSchedule: Function;
}