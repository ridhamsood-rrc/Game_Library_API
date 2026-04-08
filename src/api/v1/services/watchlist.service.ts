import { watchlistModel } from "../models/watchlist.model";
import {
  getAllWatchlistItems,
  getWatchlistItemById,
  getWatchlistByUserId,
  createWatchlistItem,
  updateWatchlistItem,
  deleteWatchlistItem,
} from "../repository/watchlist.repository";

export class WatchlistService {
  async getAllWatchlist(): Promise<watchlistModel[]> {
    return getAllWatchlistItems();
  }

  async getWatchlistById(watchlistId: string): Promise<watchlistModel> {
    const existing = await getWatchlistItemById(watchlistId);

    if (!existing) {
      throw new Error("Watchlist item not found");
    }

    return existing;
  }

  async getUserWatchlist(userId: string): Promise<watchlistModel[]> {
    return getWatchlistByUserId(userId);
  }

  async createWatchlist(data: watchlistModel): Promise<watchlistModel> {
    const userItems = await getWatchlistByUserId(data.userId);

    const existing = userItems.find((item) => item.gameId === data.gameId);

    if (existing) {
      throw new Error("Game already exists in watchlist");
    }

    return createWatchlistItem(data);
  }

  async updateWatchlist(
    watchlistId: string,
    data: Partial<watchlistModel>
  ): Promise<watchlistModel> {
    const existing = await getWatchlistItemById(watchlistId);

    if (!existing) {
      throw new Error("Watchlist item not found");
    }

    return updateWatchlistItem(watchlistId, data);
  }

  async deleteWatchlist(watchlistId: string): Promise<void> {
    const existing = await getWatchlistItemById(watchlistId);

    if (!existing) {
      throw new Error("Watchlist item not found");
    }

    const deleted = await deleteWatchlistItem(watchlistId);

    if (!deleted) {
      throw new Error("Failed to delete watchlist item");
    }
  }
}

export const watchlistService = new WatchlistService();