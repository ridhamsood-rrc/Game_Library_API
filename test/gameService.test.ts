import { gameModel } from "src/api/v1/models/gameModel";
import * as gameRepository from "../src/api/v1/repository/firestoreRepository";
import * as gameService from "../src/api/v1/services/gameService";

jest.mock("../src/api/v1/repository/firestoreRepository");

const mockGame: gameModel = {
    title: "Critical Ops",
    genre: "Shooting",
    developedBy: "John",
    size: "700MB",
    modes: ["single-player", "multiplayer"],
    platform: ["Mobile", "PlayStation"],
    rating: 9,
    releaseDate: new Date(),
    updatedAt: new Date()
};

describe("getGames service", () => {

    it("should return all games from the database", async () => {
        
        // Arrange
        (gameRepository.getGames as jest.Mock).mockResolvedValue(mockGame);

        // Act
        const result = await gameService.getGames();

        // Assert
        expect(gameRepository.getGames).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockGame);
    });

    it("should return game information based on id", async () => {

        // Arrange
        (gameRepository.getGameById as jest.Mock).mockResolvedValue(mockGame);

        // Act
        const result: gameModel | null = await gameService.getGameById("1");

        // Assert
        expect(gameRepository.getGameById).toHaveBeenCalledWith("1");
        expect(result).toEqual(mockGame);
    });

    it("should create game information successfully", async () => {

        // Arrange
        (gameRepository.createGame as jest.Mock).mockResolvedValue(mockGame);

        // Act
        const result: gameModel = await gameService.createGame(mockGame);

        // Assert
        expect(gameRepository.createGame).toHaveBeenCalledWith(mockGame);
        expect(result).toEqual(mockGame);
    });

    it("should update game information", async () => {

        // Arrange
        const updatedData = { title: "Updated Game" };
        const updatedGame = { ...mockGame, ...updatedData };

        (gameRepository.updateGame as jest.Mock).mockResolvedValue(updatedGame);

        // Act
        const result: gameModel = await gameService.updateGame("1", updatedData);

        // Assert
        expect(gameRepository.updateGame).toHaveBeenCalledWith("1", updatedData);
        expect(result.title).toBe("Updated Game");
    });

    it("should delete game information", async () => {

        // Arrange
        (gameRepository.deleteGame as jest.Mock).mockResolvedValue(true);

        // Act
        const result = await gameService.deleteGame("1");

        // Arrange
        expect(gameRepository.deleteGame).toHaveBeenCalledWith("1");
        expect(result).toBe(true);
    });
});
