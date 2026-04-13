import Joi from "joi";

/**
 * Schema for creating an user
 * Matches common course demo validation style
 */
/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - DOB
 *         - platform
 *         - subscription
 *       properties:
 *         userId:
 *           type: string
 *           description: Unique identifier for the user
 *           example: "user00001"
 *         username:
 *           type: string
 *           minLength: 3
 *           description: Full name of the user
 *           example: "Prachi"
 *         password:
 *           type: string
 *           description: User's password to login
 *           example: "Prachi13"
 *         DOB:
 *           type: string
 *           description: Date of Birth of the User
 *           example: "2013-02-13"
 *         platform:
 *           type: array
 *           enum: [PC, Mobile, PlayStation, X-Box]
 *           description: Platform user likes to play games
 *           example: ["PC", "Mobile"]
 *         subscription:
 *           type: string
 *           enum: [free, premium]
 *           description: Gives the status of the user's subscription plan
 *           example: "premium"
 *         createdAt:
 *           type: string
 *           description: When the user was created
 *           example: "2024-01-15"
 *     GetUserById:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: Unique identifier for the user
 *           example: "user00001"
 *         username:
 *           type: string
 *           minLength: 3
 *           description: Full name of the user
 *           example: "Prachi"
 *         password:
 *           type: string
 *           description: User's password to login
 *           example: "Prachi13"
 *         DOB:
 *           type: string
 *           description: Date of Birth of the User
 *           example: "2013-02-13"
 *         platform:
 *           type: array
 *           enum: [PC, Mobile, PlayStation, X-Box]
 *           description: Platform user likes to play games
 *           example: ["PC", "Mobile"]
 *         subscription:
 *           type: string
 *           enum: [free, premium]
 *           description: Gives the status of the user's subscription plan
 *           example: "premium"
 *         createdAt:
 *           type: string
 *           description: When the user was created
 *           example: "2024-01-15"
 *     UpdateUser:
 *       type: object
 *       description: At least one field must be provided to update an user
 *       minProperties: 1
 *       properties:
 *         userId:
 *           type: string
 *           description: Unique identifier for the user
 *           example: "user00001"
 *         username:
 *           type: string
 *           minLength: 3
 *           description: Full name of the user
 *           example: "Prachi"
 *         password:
 *           type: string
 *           description: User's password to login
 *           example: "Prachi13"
 *         DOB:
 *           type: string
 *           description: Date of Birth of the User
 *           example: "2013-02-13"
 *         platform:
 *           type: array
 *           enum: [PC, Mobile, PlayStation, X-Box]
 *           description: Platform user likes to play games
 *           example: ["PC", "Mobile"]
 *         subscription:
 *           type: string
 *           enum: [free, premium]
 *           description: Gives the status of the user's subscription plan
 *           example: "premium"
 *         createdAt:
 *           type: string
 *           format: date
 *           description: When the user was created
 *           example: "2024-01-15"
 *     Error:
 *       type: object
 *       required:
 *         - error
 *         - message
 *       properties:
 *         error:
 *           type: string
 *           description: Error type or code
 *           example: "VALIDATION_ERROR"
 *         message:
 *           type: string
 *           description: Human-readable error message
 *           example: "The username field is required"
 *         details:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *                 example: "username"
 *               issue:
 *                 type: string
 *                 example: "must be a valid username"
 */

export const createUserSchema = Joi.object({
    username: Joi.string().min(3).required().messages({
        "string.empty": '"username" cannot be empty',
        "string.min": '"username" must be at least 3 characters long.',
        "any.required": '"username" is required'
    }),
    password: Joi.string().min(5).required().messages({
        "string.empty": '"password" cannot be empty',
        "string.min": '"password" must be at least 3 characters long.',
        "any.required": '"password" is required'
    }),
    DOB: Joi.date().less("now").required().messages({
        "date.base": '"date" must be valid',
        "date.greater": '"date" must be lower than "now"'
    }),
    platform: Joi.array().required().items(Joi.string().valid("PC", "PlayStation", "Mobile", "X-Box")).messages({
        "string.empty": '"platform" cannot be empty.',
        "any.required": '"platform" is required.',
        "any.only": '"platform" must be one of [PC, PlayStation, X-Box, Mobile]'
    }),
    subscription: Joi.string().required().valid("free", "premium").messages({
        "string.empty": '"subscription" cannot be empty',
        "any.required": '"subscription" is required',
        "any.only": '"subscription" must be one of [free, premium]'
    }),
    createdAt: Joi.date().optional().default(new Date())
  });

export const updateUserSchema = {
    params: Joi.object({
        id: Joi.string().required().messages({
            "any.required": "Event id is required",
            "string.empty": "Event id cannot be empty"
        })
    }),

    body: Joi.object({
        username: Joi.string().min(3).messages({
            "string.empty": '"username" cannot be empty',
            "string.min": '"username" must be at least 3 characters long.',
            "any.required": '"username" is required'
        }),
        password: Joi.string().min(5).messages({
            "string.empty": '"password" cannot be empty',
            "string.min": '"password" must be at least 3 characters long.',
            "any.required": '"password" is required'
        }),
        DOB: Joi.date().less("now").messages({
            "date.base": '"date" must be valid',
            "date.greater": '"date" must be lower than "now"'
        }),
        platform: Joi.array().items(Joi.string().valid("PC", "PlayStation", "Mobile", "X-Box")).messages({
            "string.empty": '"platform" cannot be empty.',
            "any.required": '"platform" is required.',
            "any.only": '"platform" must be one of [PC, PlayStation, X-Box, Mobile]'
        }),
        subscription: Joi.string().valid("free", "premium").messages({
        "string.empty": '"subscription" cannot be empty',
        "any.required": '"subscription" is required',
        "any.only": '"subscription" must be one of [free, premium]'
        })
    }
    ).min(1)
};