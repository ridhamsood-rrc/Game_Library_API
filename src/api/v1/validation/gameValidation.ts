import Joi from "joi";

// Item operation schemas
export const itemSchemas = {
    // POST /games - create a new game
    create: {
        body: Joi.object({
            name: Joi.string().min(5).max(20).required().messages({
                "any.required": '"name" is required',
                "string.empty": '"name" cannot be empty',
                "string.min": '"name" must be at least 5 characters long.',
                "string.max": '"name" must be less than 20 characters.'
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
    }
}