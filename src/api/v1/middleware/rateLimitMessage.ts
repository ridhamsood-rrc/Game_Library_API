import { Request, Response, NextFunction } from "express";

export const rateLimitMessage = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const remainingRequests = res.get("X-RateLimit-Remaining")
    const rateResetTime = res.get("X-RateLimit-Reset")
    const resetDate = new Date(Number(rateResetTime) * 1000).toLocaleString();

    return {
        remainingRequests,
        resetDate
    }
}