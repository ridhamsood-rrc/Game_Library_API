import request, {Response} from "supertest";
import express, {Express} from "express";
import router from "../src/api/v1/routes/gameRoutes";
import * as gameController from "../src/api/v1/controllers/gameController"
import { HTTP_STATUS } from "../src/constants/httpConstants";

jest.mock("../src/api/v1/middleware/authenticate", () => ({
  __esModule: true,
  default: (req: any, res: any, next: any) => {
    res.locals.uid = "user_id";
    next();
  },
}));

jest.mock("../src/api/v1/middleware/authorize", () => ({
  __esModule: true,
  default: () => (req: any, res: any, next: any) => next(),
}));

jest.mock("../src/api/v1/middleware/validateRequest", () => ({
  validateRequest: () => (req: any, res: any, next: any) => next(),
}));

jest.mock("../src/api/v1/middleware/subscriptionMiddleware", () => ({
  __esModule: true,
  subscriptionMiddleware: () => (req: any, res: any, next: any) => {
    res.locals.subscription = "free";
    next()},
}));

jest.mock("../src/api/v1/middleware/rateLimitingMiddleware", () => ({
  __esModule: true,
  rateLimitBySubscription: () => (req: any, res: any, next: any) => next(),
}));

jest.mock("../src/api/v1/controllers/gameController")

const app: Express = express();
app.use(express.json());
app.use("/api/v1/games", router);

describe("Game Routes", () => {

    afterEach(() => {
		jest.resetAllMocks();
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