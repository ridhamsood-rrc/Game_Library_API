import { Request, Response, NextFunction } from "express";
import { getUserByUid } from "../services/userService";

export const identifyUser = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    const uid =
        authHeader && authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : null;

    res.locals.uid = uid;

    next();
};

export const subscriptionMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const uid = res.locals.uid;

        if (!uid) {
            res.locals.subscription = "guest";
            return next();
        }

        const user = await getUserByUid(uid);

        res.locals.subscription = user?.subscription || "free";

        next();
    } catch (error) {
        next(error);
    }
};