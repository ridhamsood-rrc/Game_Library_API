import request, {Response} from "supertest";
import express, {Express} from "express";
import router from "../src/api/v1/routes/gameRoutes";
import * as gameController from "../src/api/v1/controllers/gameController"
import { HTTP_STATUS } from "../src/constants/httpConstants";

jest.mock("../src/api/v1/controllers/gameController")

const app: Express = express();
app.use(express.json());
app.use("/api/v1/games", router);

describe("Game Routes", () => {

    afterEach(() => {
		jest.resetAllMocks();
	});

    describe("GET /api/v1/games", () => {
        it("should give all the games from the database", async () => {

            // Arrange
            (gameController.getGames as jest.Mock).mockImplementation(
                    (req, res) => res.status(200).json([])
            );

            // Act
            const res: Response = await request(app).get("/api/v1/games");

            // Assert
            expect(res.status).toBe(HTTP_STATUS.OK);
            expect(gameController.getGames).toHaveBeenCalled();
            });
    });

    describe("POST /api/v1/games", () => {
		it("should create game information in the database", async () => {
            
            // Arrange and Act
            (gameController.createGame as jest.Mock).mockImplementation(
                    (req, res) => res.status(201).json([])
            );
            const res: Response = await request(app)
                .post("/api/v1/games")
                .send({
                    "title": "Critical Ops",
                    "genre": "Shooting",
                    "developedBy": "John",
                    "size": "700MB",
                    "platform": ["Mobile"]
                });

            // Assert
            expect(res.status).toBe(HTTP_STATUS.CREATED);
            expect(gameController.createGame).toHaveBeenCalled();
        });
	});
});