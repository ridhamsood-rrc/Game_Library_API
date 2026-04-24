import { Request, Response, NextFunction } from "express";
import { watchlistService } from "../services/watchlist.service";
import { rateLimitMessage } from "../middleware/rateLimitMessage";

// Get all watchlist items
export const getAllWatchlist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const items = await watchlistService.getAllWatchlist();

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch watchlist items",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get one watchlist item by ID
export const getWatchlistById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const watchlistId = req.params.watchlistId as string;
    const item = await watchlistService.getWatchlistById(watchlistId);
    const LimitMessage = await rateLimitMessage(req, res, next)

    res.status(200).json({
      data: item,
      LimitMessage
    });
  } catch (error) {
    res.status(404).json({
      message: "Watchlist item not found",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get watchlist items by user ID
export const getUserWatchlist = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.userId as string;
    const items = await watchlistService.getUserWatchlist(userId);
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch user watchlist",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Create new watchlist item
export const createWatchlist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const newItem = await watchlistService.createWatchlist(req.body);
    const LimitMessage = await rateLimitMessage(req, res, next)

    res.status(201).json({
      data: newItem,
      LimitMessage
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create watchlist item",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Update watchlist item
export const updateWatchlist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const watchlistId = req.params.watchlistId as string;
    const updatedItem = await watchlistService.updateWatchlist(
      watchlistId,
      req.body
    );
    const LimitMessage = await rateLimitMessage(req, res, next)

    res.status(200).json({
      data: updatedItem,
      LimitMessage
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update watchlist item",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Delete watchlist item
export const deleteWatchlist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const watchlistId = req.params.watchlistId as string;
    await watchlistService.deleteWatchlist(watchlistId);
    const LimitMessage = await rateLimitMessage(req, res, next)

    res.status(200).json({
      message: "Watchlist item deleted successfully",
      LimitMessage
    });
  } catch (error) {
    res.status(404).json({
      message: "Failed to delete watchlist item",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};