interface ErrorHandlerProps {
    message: string;
    statusCode: number;
}

class ErrorHandler extends Error {
    public statusCode: number

    constructor({message, statusCode}: ErrorHandlerProps) {
        super(message);
        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor);
    }
}

export default ErrorHandler;