import { Router } from "express";
import {
  getAllWatchlist,
  getWatchlistById,
  getUserWatchlist,
  createWatchlist,
  updateWatchlist,
  deleteWatchlist,
} from "../controller/watchlist.controller";
import { validateRequest } from "../middleware/validateRequest";
import {
  createWatchlistSchema,
  updateWatchlistSchema,
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
 *     responses:
 *       201:
 *         description: Created
 *   get:
 *     summary: Get all watchlist items
 *     tags: [Watchlist]
 *     responses:
 *       200:
 *         description: Success
 */

/**
 * @swagger
 * /api/v1/watchlist/user/{userId}:
 *   get:
 *     summary: Get watchlist by user ID
 *     tags: [Watchlist]
 *     responses:
 *       200:
 *         description: Success
 */

/**
 * @swagger
 * /api/v1/watchlist/{watchlistId}:
 *   get:
 *     summary: Get watchlist item by ID
 *     tags: [Watchlist]
 *     responses:
 *       200:
 *         description: Success
 *   put:
 *     summary: Update watchlist item
 *     tags: [Watchlist]
 *     responses:
 *       200:
 *         description: Updated
 *   delete:
 *     summary: Delete watchlist item
 *     tags: [Watchlist]
 *     responses:
 *       200:
 *         description: Deleted
 */

router.get("/", getAllWatchlist);
router.get("/user/:userId", getUserWatchlist);
router.get("/:watchlistId", getWatchlistById);

router.post("/", validateRequest(createWatchlistSchema), createWatchlist);
router.put("/:watchlistId", validateRequest(updateWatchlistSchema), updateWatchlist);
router.delete("/:watchlistId", deleteWatchlist);

export default router;