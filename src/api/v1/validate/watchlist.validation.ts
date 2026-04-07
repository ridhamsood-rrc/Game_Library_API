import Joi from "joi";

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateWatchlistInput:
 *       type: object
 *       required:
 *         - userId
 *         - gameId
 *         - status
 *       properties:
 *         userId:
 *           type: string
 *           example: user1
 *         gameId:
 *           type: string
 *           example: game1
 *         status:
 *           type: string
 *           enum: [wishlist, playing, completed]
 *           example: wishlist
 *
 *     UpdateWatchlistInput:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           example: user1
 *         gameId:
 *           type: string
 *           example: game1
 *         status:
 *           type: string
 *           enum: [wishlist, playing, completed]
 *           example: playing
 */

export const createWatchlistSchema = Joi.object({
    userId: Joi.string().trim().required().messages({
        "any.required": "userId is required",
        "string.empty": "userId cannot be empty"
    }),

    gameId: Joi.string().trim().required().messages({
        "any.required": "gameId is required",
        "string.empty": "gameId cannot be empty"
    }),

    status: Joi.string()
        .valid("wishlist", "playing", "completed")
        .required()
        .messages({
            "any.required": "status is required",
            "string.empty": "status cannot be empty",
            "any.only": "status must be wishlist, playing, or completed"
        })
});

export const updateWatchlistSchema = Joi.object({
    userId: Joi.string().trim().optional().messages({
        "string.empty": "userId cannot be empty"
    }),

    gameId: Joi.string().trim().optional().messages({
        "string.empty": "gameId cannot be empty"
    }),

    status: Joi.string()
        .valid("wishlist", "playing", "completed")
        .optional()
        .messages({
            "string.empty": "status cannot be empty",
            "any.only": "status must be wishlist, playing, or completed"
        })
}).min(1).messages({
    "object.min": "At least one field is required for update"
});