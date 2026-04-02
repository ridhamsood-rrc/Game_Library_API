import { db } from "../../../../config/firebaseConfig";
import { gameModel } from "../models/gameModel";
import { DocumentReference, DocumentSnapshot, QuerySnapshot, DocumentData } from "firebase-admin/firestore";

// Gets all the existing events from the firestore database
export const getGames = async (): Promise<gameModel[]> => {
    const snapshot: QuerySnapshot = await db.collection("games").get();

    return snapshot.docs.map(doc => {
        const data: DocumentData = doc.data();

        return {
            id: Number(doc.id),
            name: data.name,
            genre: data.genre,
            developedBy: data.developedBy,
            createdAt: data.createdAt.toDate().toISOString(),
            updatedAt: data.createdAt.toDate().toISOString(),
            size: data.size,
            modes: data.modes,
            platform: data.platform
        };
    });
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
            name: game.name,
            genre: game.genre,
            developedBy: game.developedBy,
            createdAt: createdAt,
            size: game.size,
            modes: game.modes,
            platform: game.platform
        });
    });

    return {
        id: formattedId,
        ...game,
        createdAt: createdAt
    };
};
