import { WatchlistService } from "../src/api/v1/services/watchlist.service";
import * as watchlistRepository from "../src/api/v1/repository/watchlist.repository";
import { watchlistModel } from "../src/api/v1/models/watchlist.model";

jest.mock("../src/api/v1/repository/watchlist.repository");

describe("WatchlistService", () => {
    let service: WatchlistService;

    beforeEach(() => {
        service = new WatchlistService();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getAllWatchlist", () => {
        it("should return all watchlist items", async () => {
            // Arrange
            const mockItems: watchlistModel[] = [
                {
                    watchlistId: "watchlist00001",
                    userId: "user1",
                    gameId: "game1",
                    status: "wishlist",
                    addedAt: "2026-04-07",
                    updatedAt: "2026-04-07"
                }
            ];

            (watchlistRepository.getAllWatchlistItems as jest.Mock).mockResolvedValue(mockItems);

            // Act
            const result = await service.getAllWatchlist();

            // Assert
            expect(watchlistRepository.getAllWatchlistItems).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockItems);
        });
    });

    describe("getWatchlistById", () => {
        it("should return a watchlist item by id", async () => {
            // Arrange
            const watchlistId = "watchlist00001";
            const mockItem: watchlistModel = {
                watchlistId,
                userId: "user1",
                gameId: "game1",
                status: "wishlist",
                addedAt: "2026-04-07",
                updatedAt: "2026-04-07"
            };

            (watchlistRepository.getWatchlistItemById as jest.Mock).mockResolvedValue(mockItem);

            // Act
            const result = await service.getWatchlistById(watchlistId);

            // Assert
            expect(watchlistRepository.getWatchlistItemById).toHaveBeenCalledWith(watchlistId);
            expect(result).toEqual(mockItem);
        });

        it("should throw an error if watchlist item is not found", async () => {
            // Arrange
            const watchlistId = "watchlist99999";

            (watchlistRepository.getWatchlistItemById as jest.Mock).mockResolvedValue(null);

            // Act
            const action = service.getWatchlistById(watchlistId);

            // Assert
            await expect(action).rejects.toThrow("Watchlist item not found");
        });
    });

    describe("getUserWatchlist", () => {
        it("should return all watchlist items for a user", async () => {
            // Arrange
            const userId = "user1";
            const mockItems: watchlistModel[] = [
                {
                    watchlistId: "watchlist00001",
                    userId,
                    gameId: "game1",
                    status: "wishlist",
                    addedAt: "2026-04-07",
                    updatedAt: "2026-04-07"
                }
            ];

            (watchlistRepository.getWatchlistByUserId as jest.Mock).mockResolvedValue(mockItems);

            // Act
            const result = await service.getUserWatchlist(userId);

            // Assert
            expect(watchlistRepository.getWatchlistByUserId).toHaveBeenCalledWith(userId);
            expect(result).toEqual(mockItems);
        });
    });

    describe("createWatchlist", () => {
        it("should create a watchlist item", async () => {
            // Arrange
            const input: watchlistModel = {
                userId: "user1",
                gameId: "game1",
                status: "wishlist",
                addedAt: "2026-04-07",
                updatedAt: "2026-04-07"
            };

            const createdItem: watchlistModel = {
                watchlistId: "watchlist00001",
                userId: "user1",
                gameId: "game1",
                status: "wishlist",
                addedAt: "2026-04-07",
                updatedAt: "2026-04-07"
            };

            (watchlistRepository.getWatchlistByUserId as jest.Mock).mockResolvedValue([]);
            (watchlistRepository.createWatchlistItem as jest.Mock).mockResolvedValue(createdItem);

            // Act
            const result = await service.createWatchlist(input);

            // Assert
            expect(watchlistRepository.getWatchlistByUserId).toHaveBeenCalledWith(input.userId);
            expect(watchlistRepository.createWatchlistItem).toHaveBeenCalledWith(input);
            expect(result).toEqual(createdItem);
        });

        it("should throw an error if the game already exists in watchlist", async () => {
            // Arrange
            const input: watchlistModel = {
                userId: "user1",
                gameId: "game1",
                status: "wishlist",
                addedAt: "2026-04-07",
                updatedAt: "2026-04-07"
            };

            const existingItems: watchlistModel[] = [
                {
                    watchlistId: "watchlist00001",
                    userId: "user1",
                    gameId: "game1",
                    status: "wishlist",
                    addedAt: "2026-04-07",
                    updatedAt: "2026-04-07"
                }
            ];

            (watchlistRepository.getWatchlistByUserId as jest.Mock).mockResolvedValue(existingItems);

            // Act
            const action = service.createWatchlist(input);

            // Assert
            await expect(action).rejects.toThrow("Game already exists in watchlist");
            expect(watchlistRepository.createWatchlistItem).not.toHaveBeenCalled();
        });
    });

    describe("updateWatchlist", () => {
        it("should update a watchlist item", async () => {
            // Arrange
            const watchlistId = "watchlist00001";
            const updateData: Partial<watchlistModel> = {
                status: "playing"
            };

            const existingItem: watchlistModel = {
                watchlistId,
                userId: "user1",
                gameId: "game1",
                status: "wishlist",
                addedAt: "2026-04-07",
                updatedAt: "2026-04-07"
            };

            const updatedItem: watchlistModel = {
                watchlistId,
                userId: "user1",
                gameId: "game1",
                status: "playing",
                addedAt: "2026-04-07",
                updatedAt: "2026-04-08"
            };

            (watchlistRepository.getWatchlistItemById as jest.Mock).mockResolvedValue(existingItem);
            (watchlistRepository.updateWatchlistItem as jest.Mock).mockResolvedValue(updatedItem);

            // Act
            const result = await service.updateWatchlist(watchlistId, updateData);

            // Assert
            expect(watchlistRepository.getWatchlistItemById).toHaveBeenCalledWith(watchlistId);
            expect(watchlistRepository.updateWatchlistItem).toHaveBeenCalledWith(
                watchlistId,
                updateData
            );
            expect(result).toEqual(updatedItem);
        });

        it("should throw an error if watchlist item is not found", async () => {
            // Arrange
            const watchlistId = "watchlist99999";
            const updateData: Partial<watchlistModel> = {
                status: "playing"
            };

            (watchlistRepository.getWatchlistItemById as jest.Mock).mockResolvedValue(null);

            // Act
            const action = service.updateWatchlist(watchlistId, updateData);

            // Assert
            await expect(action).rejects.toThrow("Watchlist item not found");
            expect(watchlistRepository.updateWatchlistItem).not.toHaveBeenCalled();
        });
    });

    describe("deleteWatchlist", () => {
        it("should delete a watchlist item", async () => {
            // Arrange
            const watchlistId = "watchlist00001";
            const existingItem: watchlistModel = {
                watchlistId,
                userId: "user1",
                gameId: "game1",
                status: "wishlist",
                addedAt: "2026-04-07",
                updatedAt: "2026-04-07"
            };

            (watchlistRepository.getWatchlistItemById as jest.Mock).mockResolvedValue(existingItem);
            (watchlistRepository.deleteWatchlistItem as jest.Mock).mockResolvedValue(true);

            // Act
            await service.deleteWatchlist(watchlistId);

            // Assert
            expect(watchlistRepository.getWatchlistItemById).toHaveBeenCalledWith(watchlistId);
            expect(watchlistRepository.deleteWatchlistItem).toHaveBeenCalledWith(watchlistId);
        });

        it("should throw an error if watchlist item is not found", async () => {
            // Arrange
            const watchlistId = "watchlist99999";

            (watchlistRepository.getWatchlistItemById as jest.Mock).mockResolvedValue(null);

            // Act
            const action = service.deleteWatchlist(watchlistId);

            // Assert
            await expect(action).rejects.toThrow("Watchlist item not found");
            expect(watchlistRepository.deleteWatchlistItem).not.toHaveBeenCalled();
        });

        it("should throw an error if delete fails", async () => {
            // Arrange
            const watchlistId = "watchlist00001";
            const existingItem: watchlistModel = {
                watchlistId,
                userId: "user1",
                gameId: "game1",
                status: "wishlist",
                addedAt: "2026-04-07",
                updatedAt: "2026-04-07"
            };

            (watchlistRepository.getWatchlistItemById as jest.Mock).mockResolvedValue(existingItem);
            (watchlistRepository.deleteWatchlistItem as jest.Mock).mockResolvedValue(false);

            // Act
            const action = service.deleteWatchlist(watchlistId);

            // Assert
            await expect(action).rejects.toThrow("Failed to delete watchlist item");
        });
    });
});