import { db } from "../../../../config/firebaseConfig";
import { gameModel } from "../models/gameModel";
import { Timestamp, DocumentReference, DocumentSnapshot, QuerySnapshot, DocumentData } from "firebase-admin/firestore";

// Gets all the existing games from the firestore database
export const getGames = async (): Promise<gameModel[]> => {
    const snapshot: QuerySnapshot = await db.collection("games").get();

    return snapshot.docs.map(doc => {
        const data: DocumentData = doc.data();

        if(!data.updatedAt){
            data.updatedAt = "Not updated yet"
        } else {
            data.updatedAt = data.updatedAt.toDate().toISOString()
        }

        return {
            id: Number(doc.id),
            title: data.title,
            genre: data.genre,
            size: data.size,
            modes: data.modes,
            platform: data.platform,
            rating: data.rating,
            developedBy: data.developedBy,
            releaseDate: data.releaseDate.toDate().toISOString(),
            updatedAt: data.updatedAt,
        };
    });
};

// Gets the game by game_id from the firestore database
export const getGameById = async (
    id: string
): Promise<gameModel | null> => {
    const docRef: DocumentReference = db.collection("games").doc(id);
    const snapshot: DocumentSnapshot = await docRef.get();

    // Checks and returns null if there is nothing in the database
    if (!snapshot.exists) return null;

    const data: DocumentData = snapshot.data()!;

    if(!data.updatedAt){
        data.updatedAt = "Not updated yet"
    } else {
        data.updatedAt = data.updatedAt.toDate().toISOString()
    }

    return {
        id: Number(snapshot.id),
        title: data.title,
        genre: data.genre,
        size: data.size,
        modes: data.modes,
        rating: data.rating,
        platform: data.platform,
        developedBy: data.developedBy,
        releaseDate: data.releaseDate.toDate().toISOString(),
        updatedAt: data.updatedAt
    }
};

// Creates and add new loans to the firestore database and assign unique id
export const createGame = async (
    game: gameModel
): Promise<gameModel> => {

    const counterRef: DocumentReference = db.collection("counters").doc("numbers");

    const createdAt: Date = new Date;

    let formattedId: number = 0;

    await db.runTransaction(async (transaction) => {

        const counterDoc: DocumentSnapshot = await transaction.get(counterRef);

        let newNumber: number = 1;

        if (counterDoc.exists) {
            newNumber = counterDoc.data()!.lastNumber + 1;
        }

        // Convert id into a formatted string
        formattedId = Number(newNumber);

        transaction.set(counterRef, { lastNumber: newNumber });

        const gameRef: DocumentReference = db.collection("games").doc(String(formattedId));

        transaction.set(gameRef, {
            title: game.title,
            genre: game.genre,
            developedBy: game.developedBy,
            releaseDate: createdAt,
            size: game.size,
            modes: game.modes,
            platform: game.platform,
            rating: game.rating
        });
    });

    return {
        id: formattedId,
        ...game,
        releaseDate: createdAt
    };
};

// Helping function to use in update event function
export const serializeGame = (doc: FirebaseFirestore.DocumentSnapshot): gameModel => {
    const data: DocumentData = doc.data()!;

    return {
        id: Number(doc.id),
        title: data.title,
        genre: data.genre,
        size: data.size,
        modes: data.modes,
        platform: data.platform,
        rating: data.rating,
        developedBy: data.developedBy,
        releaseDate: data.releaseDate.toDate().toISOString(),
        updatedAt: new Date()
    };
};

// Updates an existing game in the firestore database
export const updateGame = async (
    id: string,
    data: Partial<gameModel>
): Promise<gameModel> => {

    const docRef: DocumentReference = db.collection("games").doc(id);

    // remove undefined values
    const cleanData: DocumentData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined)
    );

    // convert date into Firestore Timestamp
    if (cleanData.date) {
        cleanData.date = Timestamp.fromDate(new Date(cleanData.date));
    }

    cleanData.updatedAt = Timestamp.now();

    await docRef.update(cleanData);

    // get updated document
    const updatedDoc: DocumentSnapshot = await docRef.get();

    return serializeGame(updatedDoc);
};

// Deletes an existing game from the database
export const deleteGame = async (
    id: string
): Promise<void> => {
    const docRef: DocumentReference = db.collection("games").doc(id);

    const doc: DocumentSnapshot = await docRef.get();

    if (!doc.exists) {
        throw new Error("Game information not found");
    }

    const counterRef: DocumentReference = db.collection("counters").doc("numbers");

    await db.runTransaction(async (transaction) => {

        const counterDoc: DocumentSnapshot= await transaction.get(counterRef);

        let newNumber: number = 1;

        if (counterDoc.exists) {
            newNumber = counterDoc.data()!.lastNumber - 1;
        }
        transaction.set(counterRef, { lastNumber: newNumber });

    await docRef.delete();
})
};