export interface IAppError {
    message: string;
    statusCode: number;
    status: "fail" | "error";
    isOperational: boolean;
}

class AppError extends Error implements IAppError {
    statusCode: number;
    status: "fail" | "error";
    isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message)
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError