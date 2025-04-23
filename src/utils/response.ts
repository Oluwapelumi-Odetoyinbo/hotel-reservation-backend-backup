import { Response } from "express";

export const successResponse = (
    res: Response,
    data: any,
    message: string = 'Success',
    statusCode: number = 200
): Response => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

export const errorResponse = (
    res: Response,
    message: string = 'Internal Server Error',
    statusCode: number = 500,
    error?: any,
): Response => {
    return res.status(statusCode).json({
        success: false,
        message,
        error: process.env.NODE_ENV === 'development' ? error : undefined,
    });
}