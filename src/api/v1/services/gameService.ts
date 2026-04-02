import * as gameRepository from "../repository/firestoreRepository";
import { gameModel } from "../models/gameModel";

// Defining service to get all the games from database
export const getGames = async (): Promise<gameModel[]> => {
    const games: gameModel[] = await gameRepository.getGames();
    return games;
};

// Defining service to get game by game_id from database
export const getGameById = async (
    id: string
): Promise<gameModel | null> => {

    const game: gameModel | null = await gameRepository.getGameById(id);
    return game;
};


// Defining service to create games and add to the database
export const createGame = async (game: {
    title: string,
    genre: string,
    developedBy: string,
    releaseDate: Date,
    updatedAt: Date,
    size: string,
    modes: Array<string>,
    platform: Array<string>,
    rating: number
}): Promise<gameModel> => {
     
    const newGame: gameModel = await gameRepository.createGame(game);
    return newGame
};

// Defining service to update an existing game information in the database
export const updateGame = async (
    id: string,
    gameData: Partial<gameModel>
): Promise<gameModel> => {

    const existingGame: gameModel | null = await gameRepository.getGameById(id);

    if (!existingGame) {
        throw new Error("Game information not found");
    }

    const updatedGame: gameModel = await gameRepository.updateGame(id, gameData);

    return updatedGame;
};

// Defining service to delete an existing game in the database
export const deleteGame = async (
    id: string
): Promise<void> => {

    return await gameRepository.deleteGame(id);
};