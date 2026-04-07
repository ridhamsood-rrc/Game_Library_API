export interface Watchlist {
    id?: string;
    userId: string;
    gameId: string;
    addedAt: string;
    status: "wishlist" | "playing" | "completed";
}

export interface CreateWatchlistInput {
    gameId: string;
    status?: "wishlist" | "playing" | "completed";
}

export interface UpdateWatchlistInput {
    status: "wishlist" | "playing" | "completed";
}