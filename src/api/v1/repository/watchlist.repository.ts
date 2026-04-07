import { db } from "../../../../config/firebaseConfig";
import {
    CreateWatchlistInput,
    UpdateWatchlistInput,
    Watchlist
} from "../models/watchlist.model";

const COLLECTION_NAME = "watchlists";

export class WatchlistRepository {
    async create(userId: string, data: CreateWatchlistInput): Promise<Watchlist> {
        const newWatchlist: Watchlist = {
            userId,
            gameId: data.gameId,
            addedAt: new Date().toISOString(),
            status: data.status || "wishlist"
        };

        const docRef = await db.collection(COLLECTION_NAME).add(newWatchlist);

        return {
            id: docRef.id,
            ...newWatchlist
        };
    }

    async findByUserId(userId: string): Promise<Watchlist[]> {
        const snapshot = await db
            .collection(COLLECTION_NAME)
            .where("userId", "==", userId)
            .get();

        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Watchlist, "id">)
        }));
    }

    async findById(id: string): Promise<Watchlist | null> {
        const doc = await db.collection(COLLECTION_NAME).doc(id).get();

        if (!doc.exists) {
            return null;
        }

        return {
            id: doc.id,
            ...(doc.data() as Omit<Watchlist, "id">)
        };
    }

    async findByUserIdAndGameId(userId: string, gameId: string): Promise<Watchlist | null> {
        const snapshot = await db
            .collection(COLLECTION_NAME)
            .where("userId", "==", userId)
            .where("gameId", "==", gameId)
            .limit(1)
            .get();

        if (snapshot.empty) {
            return null;
        }

        const doc = snapshot.docs[0];

        return {
            id: doc.id,
            ...(doc.data() as Omit<Watchlist, "id">)
        };
    }

    async update(id: string, data: UpdateWatchlistInput): Promise<Watchlist | null> {
        const docRef = db.collection(COLLECTION_NAME).doc(id);
        const existing = await docRef.get();

        if (!existing.exists) {
            return null;
        }

       await docRef.update(data as Partial<Watchlist>);

        const updated = await docRef.get();

        return {
            id: updated.id,
            ...(updated.data() as Omit<Watchlist, "id">)
        };
    }

    async delete(id: string): Promise<boolean> {
        const docRef = db.collection(COLLECTION_NAME).doc(id);
        const existing = await docRef.get();

        if (!existing.exists) {
            return false;
        }

        await docRef.delete();
        return true;
    }
}