export interface watchlistModel {
  watchlistId?: string;
  userId: string;
  gameId: string;
  status: "wishlist" | "playing" | "completed";
  addedAt?: string;
  updatedAt?: string;
}