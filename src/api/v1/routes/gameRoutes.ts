import express, { Router } from "express";
import * as gameController from "../controllers/gameController";
import { validateRequest } from "../middleware/validate";
import { itemSchemas } from "../validation/gameValidation";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";
import { subscriptionMiddleware } from "../middleware/subscriptionMiddleware";
import { rateLimitBySubscription } from "../middleware/rateLimitingMiddleware";

const router: Router = express.Router();

/**
 * @openapi
 * /games:
 *   get:
 *     summary: Get all games from database
 *     description: Retrieve a list of games from the firestore database
 *     tags: [Games]
 *     responses:
 *       '200':
 *         description: Successfully retrieved all games
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: number
 *                      example: 1
 *                    title:
 *                      type: string
 *                      example: "Call Of Duty"
 *                    genre:
 *                      type: string
 *                      example: "Shooting"
 *                    size:
 *                      type: string
 *                      example: "1000MB"
 *                    modes:
 *                      type: array
 *                      example: ["single-player", "multiplayer"]
 *                    platform:
 *                      type: array
 *                      example: ["Mobile", "PlayStation"]
 *                    rating:
 *                      type: number
 *                      example: 9
 *                    developedBy:
 *                      type: string
 *                      example: "Infinity Ward"
 *                    createdAt:
 *                      type: date
 *                      example: "2025-05-05T10:30:00Z"
 *                    updatedAt:
 *                      type: date
 *                      example: "2026-05-03T10:30:00Z"
 */
router.get("/",
    authenticate,
    subscriptionMiddleware,
    rateLimitBySubscription(1),
    gameController.getGames);

/**
 * @openapi
 * /games/{gameId}:
 *   get:
 *     summary: Get a specific game's information
 *     tags: [Games]
 *     parameters:
 *       - name: gameId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the game
 *     responses:
 *       '200':
 *         description: Game information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetGameById'
 *       '404':
 *         description: Game not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Game not found"
 */

router.get("/:id",
    authenticate,
    isAuthorized({hasRole: ["freeUser", "premiumUser"]}),
    subscriptionMiddleware,
    rateLimitBySubscription(0.5),
    validateRequest(itemSchemas.getGameById),
    gameController.getGameById);

/**
 * @openapi
 * /games:
 *   post:
 *     summary: Create a new game information in the firestore database
 *     tags: [Games]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Game'
 *     responses:
 *       '201':
 *         description: Game information created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       '400':
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

router.post("/",
    authenticate,
    isAuthorized({hasRole: ["admin"]}),
    validateRequest(itemSchemas.create),
    gameController.createGame);

    /**
 * @openapi
 * /games/{gameId}:
 *   put:
 *     summary: Update a specific game's information
 *     tags: [Games]
 *     parameters:
 *       - name: gameId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the game
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateGame'
 *     responses:
 *       '200':
 *         description: Game information updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateGame'
 *       '400':
 *          description: Invalid input data
 *          content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: Game not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Game not found"
 */

router.put("/:id",
    authenticate,
    isAuthorized({hasRole: ["admin"]}),
    validateRequest(itemSchemas.updateGame),
    gameController.updateGame);

/**
 * @openapi
 * /games/{gameId}:
 *   delete:
 *     summary: Delete a specific game's information
 *     tags: [Games]
 *     parameters:
 *       - name: gameId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the game
 *     responses:
 *       '200':
 *         description: Game deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                      example: "Game deleted successfully"
 *       '404':
 *         description: Game not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Game not found"
 */

router.delete("/:id",
    authenticate,
    isAuthorized({hasRole: ["admin"]}),
    validateRequest(itemSchemas.deleteGame),
    gameController.deleteGame
)

export default router