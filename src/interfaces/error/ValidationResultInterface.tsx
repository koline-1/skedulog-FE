export interface ValidationResultInterface {
    ok: boolean;
    error: {
        name: string;
        code: string;
        message: string;
    }
}