import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";
import { MiddlewareFunction } from "../types/express";
import { HTTP_STATUS } from "../../../constants/httpConstants";

interface RequestSchema {
    body?: ObjectSchema,
    params?: ObjectSchema,
    query?: ObjectSchema
};

interface ValidationOptions {
    stripBody?: boolean,
    stripQuery?: boolean,
    stripParams?: boolean
};

// middleware added to the request cycle
/**
 * Express middleware function validating parts of the request against
 * JOi scheams and stripping unknown fields appropriately
 * @param schemas - Object containing shcemas for body, params abd queries
 * @param options - Validation options stripping values
 * @returns Express middleware function that performs validation
 */

export const validateRequest = (
    schemas: RequestSchema,
    options: ValidationOptions = {}
): MiddlewareFunction => {

    const defaultOptions = {
        stripBody: true,
        stripQuery: true,
        stripParams: false,
        ...options
    }


    return (req: Request, res: Response, next: NextFunction) => {
        try{

            const errors: string[] = [];

            const validatePart = (
                schema: ObjectSchema,
                data: any,
                partName: string,
                shouldStrip: boolean
            ) => {
                const { error, value } = schema.validate(data, {
                    abortEarly: false,
                    stripUnknown: shouldStrip
                })

                if (error) {
                    errors.push(
                        ...error.details.map(detail => {
                            return `${partName}: ${detail.message}`
                        })
                    )
                } else if(shouldStrip) {
                    return value;
                } else {
                    return data;
                }
            }

            if (schemas.body) {
                req.body = validatePart(
                    schemas.body,
                    req.body,
                    "Body",
                    defaultOptions.stripBody
                )
            }

            if (schemas.params) {
                req.params = validatePart(
                    schemas.params,
                    req.params,
                    "Params",
                    defaultOptions.stripParams
                )
            }

            if (schemas.query) {
                req.query = validatePart(
                    schemas.query,
                    req.query,
                    "Query",
                    defaultOptions.stripQuery
                )
            }

            if(errors.length > 0) {
                return res.status(HTTP_STATUS. BAD_REQUEST).json({
                    message: `Validation error(s): ${errors.join(", ")}`
                })
            }

            next();
        } catch (error: unknown) {
            return res.status(HTTP_STATUS. BAD_REQUEST).json({
                error: (error as Error).message
            })
        }
    }
}