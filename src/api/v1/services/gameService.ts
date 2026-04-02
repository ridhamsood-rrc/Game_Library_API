import * as gameRepository from "../repository/firestoreRepository";
import { gameModel } from "../models/gameModel";

// Defining service to get all the events from database
export const getGames = async (): Promise<gameModel[]> => {
    const games: gameModel[] = await gameRepository.getGames();
    return games;
};

// Defining service to create loans and add to the database
export const createGame = async (game: {
    name: string,
    genre: string,
    developedBy: string,
    createdAt: Date,
    updatedAt: Date,
    size: string,
    modes: string,
    platform: string
}): Promise<gameModel> => {
     
    const newGame: gameModel = await gameRepository.createGame(game);
    return newGame
};