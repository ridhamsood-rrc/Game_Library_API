import { Request, Response } from "express";
import { watchlistService } from "../services/watchlist.service";

// Get all watchlist items
export const getAllWatchlist = async (
  _req: Request,
  res: Response
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
  res: Response
): Promise<void> => {
  try {
    const watchlistId = req.params.watchlistId as string;
    const item = await watchlistService.getWatchlistById(watchlistId);
    res.status(200).json(item);
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
  res: Response
): Promise<void> => {
  try {
    const newItem = await watchlistService.createWatchlist(req.body);
    res.status(201).json(newItem);
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
  res: Response
): Promise<void> => {
  try {
    const watchlistId = req.params.watchlistId as string;
    const updatedItem = await watchlistService.updateWatchlist(
      watchlistId,
      req.body
    );
    res.status(200).json(updatedItem);
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
  res: Response
): Promise<void> => {
  try {
    const watchlistId = req.params.watchlistId as string;
    await watchlistService.deleteWatchlist(watchlistId);
    res.status(200).json({
      message: "Watchlist item deleted successfully",
    });
  } catch (error) {
    res.status(404).json({
      message: "Failed to delete watchlist item",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};