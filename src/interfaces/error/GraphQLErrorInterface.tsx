import { ValidationResultInterface } from "./ValidationResultInterface";

export interface GraphQLErrorInterface {
    message?: string;
    extensions: {
        code?: string;
        exception: {
            stacktrace?: [string];
        }
        http: {
            code: string;
            message: string;
            status: number;
            validationResult?: [ValidationResultInterface]
        }
    }
}