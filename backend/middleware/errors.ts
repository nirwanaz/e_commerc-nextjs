import { NextApiRequest, NextApiResponse } from "next";
import ErrorHandler from "../utils/errorHandler";

export default (err: any, req: NextApiRequest, res: NextApiResponse) => {
    let error: ErrorHandler = { ...err };

    error.statusCode = err.statusCode || 500;
    error.message = err.message || "Internal Server Error";

    if (err.name == "ValidationError") {
        const message = Object.values(err.errors).map<string>((value: any) => value.message)
        error = new ErrorHandler({ message: message.join('\n'), statusCode: 400 })
    }

    if (err.code == 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        error = new ErrorHandler({ message, statusCode: 400 })
    }

    res.status(error.statusCode).json({
        success: false,
        error,
        message: error.message,
        stack: error.stack
    })

}