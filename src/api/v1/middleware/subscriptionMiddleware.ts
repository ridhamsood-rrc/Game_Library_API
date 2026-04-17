import { Request, Response, NextFunction} from "express";
import { getUserById } from "../repository/userFirestoreRepository";
import { userModel } from "../models/userModel";

export const subscriptionMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {

        const user_id = res.locals.uid
        const identifyUser: userModel = await getUserById(user_id)

        if(!identifyUser) {
            throw new Error("Invalid User!")
        }

        res.locals.subscription = identifyUser.subscription

        next()
    } catch (error) {
        next(error);
    }
}