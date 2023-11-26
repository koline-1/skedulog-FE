import { ResultStatusType } from "antd/es/result";
import { MouseEventHandler } from "react";

export interface ErrorInterface {
    status: ResultStatusType;
    title: string;
    subTitle?: string;
    buttonText?: string;
    onClick?: MouseEventHandler;
}