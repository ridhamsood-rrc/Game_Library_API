import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";

export const validateRequest =
    (schema: ObjectSchema) =>
    (req: Request, res: Response, next: NextFunction): void => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            res.status(400).json({
                success: false,
                message: "Validation error",
                errors: error.details.map((detail) => detail.message)
            });
            return;
        }

        next();
    };