import Joi from "joi";

/**
 * @openapi
 * components:
 *   schemas:
 *     Game:
 *       type: object
 *       required:
 *         - title
 *         - genre
 *         - size
 *         - platform
 *         - developedBy
 *       properties:
 *         id:
 *           type: number
 *           description: Unique identifier for the game
 *           example: 1
 *         title:
 *           type: string
 *           minLength: 5
 *           maxLength: 50
 *           description: Full name of the game
 *           example: "Call Of Duty"
 *         genre:
 *           type: string
 *           enum: [Shooting, Open-World, Simulation, Sports, Action]
 *           description: The type of game
 *           example: "Shooting"
 *         modes:
 *           type: array
 *           default: ["single-player"]
 *           enum: [single-player, multiplayer, hybrid]
 *           description: The modes of the game
 *           example: ["single-player", "multiplayer"]
 *         size:
 *           type: string
 *           description: The total size of the game
 *           example: "500MB"
 *         platform:
 *           type: array
 *           enum: [PC, Playstation, X-Box, Mobile]
 *           description: Platform's the game is available on
 *           example: ["PC", "PlayStation"]
 *         rating:
 *           type: number
 *           default: 5
 *           description: The rating of the game
 *           example: 9
 *         developedBy:
 *           type: string
 *           description: The creator of the game
 *           example: "Infinity Ward"
 *         releaseDate:
 *           type: string
 *           format: date-time
 *           description: When the game information was released
 *           example: "2024-01-15T10:30:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the game information was last updated
 *           example: "2024-01-20T14:45:00Z"
 *     GetGameById:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           minLength: 5
 *           maxLength: 50
 *           description: Full name of the game
 *           example: "Call Of Duty"
 *         genre:
 *           type: string
 *           enum: [Shooting, Open-World, Simulation, Sports, Action]
 *           description: The type of game
 *           example: "Shooting"
 *         modes:
 *           type: array
 *           default: ["single-player"]
 *           enum: [single-player, multiplayer, hybrid]
 *           description: The modes of the game
 *           example: ["single-player", "multiplayer"]
 *         size:
 *           type: string
 *           description: The total size of the game
 *           example: "500MB"
 *         platform:
 *           type: array
 *           enum: [PC, Playstation, X-Box, Mobile]
 *           description: Platform's the game is available on
 *           example: ["PC", "PlayStation"]
 *         rating:
 *           type: number
 *           default: 5
 *           description: The rating of the game
 *           example: 9
 *         developedBy:
 *           type: string
 *           description: The creator of the game
 *           example: "Infinity Ward"
 *         releaseDate:
 *           type: string
 *           format: date-time
 *           description: When the game information was released
 *           example: "2024-01-15T10:30:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the game information was last updated
 *           example: "2024-01-20T14:45:00Z"
 *     UpdateGame:
 *       type: object
 *       description: Fields to update for a game (at least one must be provided)
 *       minProperties: 1
 *       properties:
 *         title:
 *           type: string
 *           minLength: 5
 *           maxLength: 50
 *           description: Full name of the game
 *           example: "Call Of Duty"
 *         genre:
 *           type: string
 *           enum: [Shooting, Open-World, Simulation, Sports, Action]
 *           description: The type of game
 *           example: "Shooting"
 *         modes:
 *           type: array
 *           default: ["single-player"]
 *           enum: [single-player, multiplayer, hybrid]
 *           description: The modes of the game
 *           example: ["single-player", "multiplayer"]
 *         size:
 *           type: string
 *           description: The total size of the game
 *           example: "500MB"
 *         platform:
 *           type: array
 *           enum: [PC, Playstation, X-Box, Mobile]
 *           description: Platform's the game is available on
 *           example: ["PC", "PlayStation"]
 *         rating:
 *           type: number
 *           default: 5
 *           description: The rating of the game
 *           example: 9
 *         developedBy:
 *           type: string
 *           description: The creator of the game
 *           example: "Infinity Ward"
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
 *           example: "The title field is required"
 *         details:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *                 example: "title"
 *               issue:
 *                 type: string
 *                 example: "must be a valid title"
 */


// Item operation schemas
export const itemSchemas = {
    // POST /games - create a new game
    create: {
        body: Joi.object({
            title: Joi.string().min(5).max(50).required().messages({
                "any.required": '"title" is required',
                "string.empty": '"title" cannot be empty',
                "string.min": '"title" must be at least 5 characters long.',
                "string.max": '"title" must be less than 50 characters.'
            }),
            genre: Joi.string().required().valid("Shooting", "Open-World", "Sports", "Simulation", "Action").messages({
                "number.required": '"capacity" is required.',
                "string.empty": '"genre" cannot be empty',
                "any.only": '"genre" must be one of [Shooting, Open-World, Sports, Simulation, Action]'
            }),
            developedBy: Joi.string().required().messages({
                "any.required": '"developedBy" is required',
                "string.empty": '"developedBy" cannot be empty',
            }),
            size: Joi.string().required().messages({
                "any.required": '"size" is required',
                "string.empty": '"size" cannot be empty.'
            }),
            platform: Joi.array().required().items(Joi.string().valid("PC", "PlayStation", "X-Box", "Mobile")).messages({
                "any.required": '"platform" is required',
                "string.empty": '"platform" cannot be empty',
                "any.only": '"platform" must be one of [PC, PlayStation, X-Box, Mobile]'
            }),
            modes: Joi.array().optional().default(["single-player"]).items(Joi.string().valid("single-player", "multi-player", "hybrid")).messages({
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
            title: Joi.string().min(5).max(50).messages({
                "string.min": '"title" must be at least 5 characters long.',
                "string.max": '"title" must be less than 50 characters.'
            }),
            genre: Joi.string().valid("Shooting", "Open-World", "Sports", "Simulation", "Action").messages({
                "any.only": '"genre" must be one of [Shooting, Open-World, Sports, Simulation, Action]'
            }),
            platform: Joi.string().valid("PC", "PlayStation", "X-Box", "Mobile").messages({
                "any.only": '"platform" must be one of [PC, PlayStation, X-Box, Mobile]'
            }),
            size: Joi.string().messages({
                "any.required": '"size" is required',
                "string.empty": '"size" cannot be empty.'
            }),
            modes: Joi.string().default("single-player").valid("single-player", "multi-player", "hybrid").messages({
                "any.only": '"modes" must be one of [single-player, multi-player, hybrid]'
            }),
            developedBy: Joi.string().messages({
                "any.required": '"developedBy" is required',
                "string.empty": '"developedBy" cannot be empty',
            }),
            rating: Joi.number()
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