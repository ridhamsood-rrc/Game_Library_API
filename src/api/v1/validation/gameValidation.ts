import Joi from "joi";

// Item operation schemas
export const itemSchemas = {
    // POST /games - create a new game
    create: {
        body: Joi.object({
            title: Joi.string().min(5).max(30).required().messages({
                "any.required": '"title" is required',
                "string.empty": '"title" cannot be empty',
                "string.min": '"title" must be at least 5 characters long.',
                "string.max": '"title" must be less than 30 characters.'
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
            rating: Joi.number().optional().default(5.0),
            releaseDate: Joi.date().optional().default(new Date()),
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
            title: Joi.string().min(5).max(30).messages({
                "string.min": '"title" must be at least 5 characters long.',
                "string.max": '"title" must be less than 30 characters.'
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