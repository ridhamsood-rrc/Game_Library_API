import Joi from "joi";

// Item operation schemas
export const itemSchemas = {
    // POST /games - create a new game
    create: {
        body: Joi.object({
            name: Joi.string().min(5).max(30).required().messages({
                "any.required": '"name" is required',
                "string.empty": '"name" cannot be empty',
                "string.min": '"name" must be at least 5 characters long.',
                "string.max": '"name" must be less than 30 characters.'
            }),
            genre: Joi.string().required().valid("Shooting", "Open-World", "Sports", "Simulation").messages({
                "number.required": '"capacity" is required.',
                "string.empty": '"genre" cannot be empty',
                "any.only": '"genre" must be one of [Shooting, Open-World, Sports, Simulation]'
            }),
            developedBy: Joi.string().required().messages({
                "any.required": '"developedBy" is required',
                "string.empty": '"developedBy" cannot be empty',
            }),
            size: Joi.string().required().messages({
                "any.required": '"size" is required',
                "string.empty": '"size" cannot be empty.'
            }),
            platform: Joi.string().required().valid("PC", "PlayStation", "X-Box", "Mobile").messages({
                "any.required": '"platform" is required',
                "string.empty": '"platform" cannot be empty',
                "any.only": '"platform" must be one of [PC, PlayStation, X-Box, Mobile]'
            }),
            modes: Joi.string().optional().default("single-player").valid("single-player", "multi-player", "hybrid").messages({
                "any.only": '"modes" must be one of [single-player, multi-player, hybrid]'
            }),
            createdAt: Joi.date().optional().default(new Date()),
        })
    },
    // GET /games/:id - Get game by game_id
    getGameById: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Game ID is required.",
                "string.empty": "Game ID cannot be empty."
            })
        })
    },

    // PUT /games/:id - Updates an existing game
    updateGame: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Game ID is required.",
                "string.empty": "Game ID cannot be empty."
            })
        }),
        body: Joi.object({
            name: Joi.string().min(5).max(30).messages({
                "string.min": '"name" must be at least 5 characters long.',
                "string.max": '"name" must be less than 30 characters.'
            }),
            genre: Joi.string().valid("Shooting", "Open-World", "Sports", "Simulation").messages({
                "any.only": '"genre" must be one of [Shooting, Open-World, Sports, Simulation]'
            }),
            platform: Joi.string().valid("PC", "PlayStation", "X-Box", "Mobile").messages({
                "any.only": '"platform" must be one of [PC, PlayStation, X-Box, Mobile]'
            }),
            modes: Joi.string().default("single-player").valid("single-player", "multi-player", "hybrid").messages({
                "any.only": '"modes" must be one of [single-player, multi-player, hybrid]'
            })
        }).min(1)
    },

    // DELETE /games/:id - Deletes an existing game
    deleteGame: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "Game ID is required.",
                "string.empty": "Game ID cannot be empty."
            })
        })
    }
}