import Joi from "joi";

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
    createdAt: Joi.date().optional().default(new Date())
  });