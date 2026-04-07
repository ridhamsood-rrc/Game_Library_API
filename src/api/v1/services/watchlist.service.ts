import {
    CreateWatchlistInput,
    UpdateWatchlistInput,
    Watchlist
} from "../models/watchlist.model";
import { WatchlistRepository } from "../repository/watchlist.repository";

export class WatchlistService {
    constructor(private readonly watchlistRepository: WatchlistRepository) {}

    async createWatchlist(userId: string, data: CreateWatchlistInput): Promise<Watchlist> {
        const existing = await this.watchlistRepository.findByUserIdAndGameId(
            userId,
            data.gameId
        );

        if (existing) {
            throw new Error("Game already exists in watchlist");
        }

        return this.watchlistRepository.create(userId, data);
    }

    async getUserWatchlist(userId: string): Promise<Watchlist[]> {
        return this.watchlistRepository.findByUserId(userId);
    }

    async updateWatchlist(
        id: string,
        userId: string,
        data: UpdateWatchlistInput
    ): Promise<Watchlist> {
        const existing = await this.watchlistRepository.findById(id);

        if (!existing) {
            throw new Error("Watchlist item not found");
        }

        if (existing.userId !== userId) {
            throw new Error("Unauthorized");
        }

        const updated = await this.watchlistRepository.update(id, data);

        if (!updated) {
            throw new Error("Failed to update watchlist item");
        }

        return updated;
    }

    async deleteWatchlist(id: string, userId: string): Promise<void> {
        const existing = await this.watchlistRepository.findById(id);

        if (!existing) {
            throw new Error("Watchlist item not found");
        }

        if (existing.userId !== userId) {
            throw new Error("Unauthorized");
        }

        const deleted = await this.watchlistRepository.delete(id);

        if (!deleted) {
            throw new Error("Failed to delete watchlist item");
        }
    }
}

export const watchlistService = new WatchlistService(new WatchlistRepository());