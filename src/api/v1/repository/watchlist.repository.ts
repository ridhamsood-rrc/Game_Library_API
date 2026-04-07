import { db } from "../../../../config/firebaseConfig";
import { watchlistModel } from "../models/watchlist.model";

const collection = db.collection("watchlist");

// Get all watchlist items
export const getAllWatchlistItems = async (): Promise<watchlistModel[]> => {
  const snapshot = await collection.get();

  return snapshot.docs.map((doc) => ({
    watchlistId: doc.id,
    ...(doc.data() as watchlistModel),
  }));
};

// Get one watchlist item by ID
export const getWatchlistItemById = async (
  watchlistId: string
): Promise<watchlistModel | null> => {
  const doc = await collection.doc(watchlistId).get();

  if (!doc.exists) return null;

  return {
    watchlistId: doc.id,
    ...(doc.data() as watchlistModel),
  };
};

// Get all watchlist items for a specific user
export const getWatchlistByUserId = async (
  userId: string
): Promise<watchlistModel[]> => {
  const snapshot = await collection.where("userId", "==", userId).get();

  return snapshot.docs.map((doc) => ({
    watchlistId: doc.id,
    ...(doc.data() as watchlistModel),
  }));
};

// Create a new watchlist item
export const createWatchlistItem = async (
  item: watchlistModel
): Promise<watchlistModel> => {
  const snapshot = await collection.get();
  const count = snapshot.size + 1;

  const watchlistId = `watchlist${String(count).padStart(5, "0")}`;

  const newItem = {
    userId: item.userId,
    gameId: item.gameId,
    status: item.status,
    addedAt: new Date().toISOString().split("T")[0],
    updatedAt: new Date().toISOString().split("T")[0],
  };

  await collection.doc(watchlistId).set(newItem);

  return {
    watchlistId,
    ...newItem,
  };
};

// Update existing watchlist item
export const updateWatchlistItem = async (
  watchlistId: string,
  data: Partial<watchlistModel>
): Promise<watchlistModel> => {
  const docRef = collection.doc(watchlistId);
  const doc = await docRef.get();

  if (!doc.exists) {
    throw new Error("Watchlist item not found");
  }

  const updateData = Object.fromEntries(
    Object.entries(data).filter(
      ([key, value]) =>
        key !== "watchlistId" &&
        key !== "addedAt" &&
        value !== undefined
    )
  );

  if (Object.keys(updateData).length === 0) {
    throw new Error("No valid fields provided for update");
  }

  updateData.updatedAt = new Date().toISOString().split("T")[0];

  await docRef.update(updateData);

  const updatedDoc = await docRef.get();

  return {
    watchlistId,
    ...(updatedDoc.data() as watchlistModel),
  };
};

// Delete watchlist item
export const deleteWatchlistItem = async (
  watchlistId: string
): Promise<boolean> => {
  const docRef = collection.doc(watchlistId);
  const doc = await docRef.get();

  if (!doc.exists) return false;

  await docRef.delete();
  return true;
};