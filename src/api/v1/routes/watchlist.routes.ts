import { Router } from "express";
import {
  getAllWatchlist,
  getWatchlistById,
  createWatchlist,
  updateWatchlist,
  deleteWatchlist,
} from "../controller/watchlist.controller";
import { validateRequest } from "../middleware/watchlistValidateRequest";
import {
  createWatchlistSchema,
  updateWatchlistSchema,
} from "../validate/watchlist.validation";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";
import { subscriptionMiddleware } from "../middleware/subscriptionMiddleware";
import { rateLimitBySubscription } from "../middleware/rateLimitingMiddleware";

const router = Router();

/**
 * @openapi
 * tags:
 *   name: Watchlist
 *   description: Watchlist management endpoints
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Watchlist:
 *       type: object
 *       properties:
 *         watchlistId:
 *           type: string
 *           example: watchlist00001
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
 *         addedAt:
 *           type: string
 *           example: 2026-04-07
 *         updatedAt:
 *           type: string
 *           example: 2026-04-07
 */

/**
 * @openapi
 * /api/v1/watchlist:
 *   post:
 *     summary: Add a game to watchlist
 *     tags: [Watchlist]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - gameId
 *               - status
 *             properties:
 *               userId:
 *                 type: string
 *               gameId:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [wishlist, playing, completed]
 *     responses:
 *       201:
 *         description: Watchlist item created successfully
 *       400:
 *         description: Invalid input
 *   get:
 *     summary: Get all watchlist items
 *     tags: [Watchlist]
 *     responses:
 *       200:
 *         description: Successfully retrieved watchlist items
 */

/**
 * @openapi
 * /api/v1/watchlist/{watchlistId}:
 *   get:
 *     summary: Get watchlist item by ID
 *     tags: [Watchlist]
 *     parameters:
 *       - in: path
 *         name: watchlistId
 *         required: true
 *         schema:
 *           type: string
 *         description: Watchlist item ID
 *     responses:
 *       200:
 *         description: Successfully retrieved watchlist item
 *       404:
 *         description: Watchlist item not found
 *   put:
 *     summary: Update watchlist item
 *     tags: [Watchlist]
 *     parameters:
 *       - in: path
 *         name: watchlistId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [wishlist, playing, completed]
 *     responses:
 *       200:
 *         description: Watchlist item updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Watchlist item not found
 *   delete:
 *     summary: Delete watchlist item
 *     tags: [Watchlist]
 *     parameters:
 *       - in: path
 *         name: watchlistId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Watchlist item deleted successfully
 *       404:
 *         description: Watchlist item not found
 */

router.get("/",
  authenticate,
  isAuthorized({hasRole: ["manager"]}),
  getAllWatchlist);

router.get("/:watchlistId",
  authenticate,
  subscriptionMiddleware,
  rateLimitBySubscription(),
  getWatchlistById);

router.post("/",
  authenticate,
  isAuthorized({hasRole: ["freeUser", "premiumUser"]}),
  subscriptionMiddleware,
  rateLimitBySubscription(),
  validateRequest(createWatchlistSchema),
  createWatchlist);

router.put("/:watchlistId",
  authenticate,
  isAuthorized({hasRole: ["manager", "freeUser", "premiumUser"]}),
  subscriptionMiddleware,
  rateLimitBySubscription(),
  validateRequest(updateWatchlistSchema),
  updateWatchlist);

router.delete("/:watchlistId",
  authenticate,
  isAuthorized({hasRole: ["manager", "freeUser", "premiumUser"]}),
  subscriptionMiddleware,
  rateLimitBySubscription(),
  deleteWatchlist);

export default router;