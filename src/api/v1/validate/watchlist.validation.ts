import Joi from "joi";

export const createWatchlistSchema = Joi.object({
    gameId: Joi.string().trim().required().messages({
        "any.required": "gameId is required",
        "string.empty": "gameId cannot be empty"
    }),
    status: Joi.string()
        .valid("wishlist", "playing", "completed")
        .optional()
});

export const updateWatchlistSchema = Joi.object({
    status: Joi.string()
        .valid("wishlist", "playing", "completed")
        .required()
        .messages({
            "any.required": "status is required",
            "string.empty": "status cannot be empty"
        })
});