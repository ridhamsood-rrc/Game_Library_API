import { NextFunction, Request, Response } from "express";
import { auth } from "../../../../config/firebaseConfig";

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                success: false,
                message: "Token not provided"
            });
            return;
        }

        const token = authHeader.split(" ")[1];
        const decodedToken = await auth.verifyIdToken(token);

        res.locals.user = decodedToken;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};