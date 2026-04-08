import { NextFunction, Request, Response } from "express";

export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const message = error.message || "Internal server error";

    let statusCode = 500;

    if (message === "Watchlist item not found") {
        statusCode = 404;
    }

    if (message === "Unauthorized") {
        statusCode = 403;
    }

    if (message === "Game already exists in watchlist") {
        statusCode = 409;
    }

    res.status(statusCode).json({
        success: false,
        message
    });
};