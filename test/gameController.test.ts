import express, {Express, NextFunction, Request, Response} from "express";
import router from '../src/api/v1/routes/gameRoutes';
import { HTTP_STATUS } from "../src/constants/httpConstants";
import * as gameController from '../src/api/v1/controllers/gameController';
import * as gameService from '../src/api/v1/services/gameService';
import { gameModel } from "../src/api/v1/models/gameModel";

jest.mock('../src/api/v1/services/gameService');

const app: Express = express();
app.use(express.json());
app.use("/api/v1/games", router);

describe('Controller Name', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = {
      params: {},
      body: {},
      query: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
    mockNext = jest.fn();
  });

    describe('Create Controller tests', () => {
        it('should create game information successfully', async () => {

            // Arrange
            mockReq.body = { 
                "name": "Critical Ops",
                "genre": "Shooting",
                "developedBy": "John",
                "size": "700MB",
                "platform": "Mobile"
            };

            const game = { 
                id: 1,
                ...mockReq.body
            };
            (gameService.createGame as jest.Mock).mockResolvedValue(game);

            // Act
            await gameController.createGame(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Game Information created",
                data: game
            });
        });
    });

    describe("Delete game Controller", () => {

        it("should delete the game information successfully", async () => {

            // Arrange
            mockReq.params = { id: "1" };

            (gameService.getGameById as jest.Mock).mockResolvedValue({
                id: 1
            });
            (gameService.deleteGame as jest.Mock).mockResolvedValue(true);

            // Act
            await gameController.deleteGame(mockReq as Request, mockRes as Response, mockNext);

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Game with id: "1" deleted successfully'
            });
        });
    });

    describe("Update game information Controller", () => {

        it("should update the game information successfully", async() => {

            // Arrange
            mockReq = {
                params: { 
                    id: "1" 
                },
                body: { 
                    name: "New game", 
                }
            };
            const mockGame: gameModel = {
                id: 1,
                name: "old game",
                genre: "Shooting",
                developedBy: "John",
                size: "700MB",
                platform: "Mobile",
                modes: "single-player",
                createdAt: new Date(),
                updatedAt: new Date()
            };

            (gameService.getGameById as jest.Mock).mockResolvedValue({
                id: "1"
            });
            const updatedGame: gameModel = { ...mockGame, ...mockReq.body };
            (gameService.updateGame as jest.Mock).mockResolvedValue(updatedGame);

            // Act
            await gameController.updateGame(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            // Assert
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: `Game Information updated`,
                data: updatedGame
            });
        });
    });
});