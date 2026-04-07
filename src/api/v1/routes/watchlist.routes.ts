import { Router } from "express";
import {
    createWatchlist,
    deleteWatchlist,
    getUserWatchlist,
    updateWatchlist
} from "../controller/watchlist.controller";
import { authenticate } from "../middleware/authMiddleware";
import { validateRequest } from "../middleware/validateRequest";
import {
    createWatchlistSchema,
    updateWatchlistSchema
} from "../validate/watchlist.validation";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Watchlist
 *   description: Watchlist management endpoints
 */

/**
 * @swagger
 * /api/v1/watchlist:
 *   post:
 *     summary: Add a game to watchlist
 *     tags: [Watchlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Created
 *   get:
 *     summary: Get user's watchlist
 *     tags: [Watchlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 */

/**
 * @swagger
 * /api/v1/watchlist/{id}:
 *   put:
 *     summary: Update watchlist item
 *     tags: [Watchlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Updated
 *   delete:
 *     summary: Delete watchlist item
 *     tags: [Watchlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Deleted
 */

router.post("/", authenticate, validateRequest(createWatchlistSchema), createWatchlist);
router.get("/", authenticate, getUserWatchlist);
router.put("/:id", authenticate, validateRequest(updateWatchlistSchema), updateWatchlist);
router.delete("/:id", authenticate, deleteWatchlist);

export default router;