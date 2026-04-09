import request, {Response} from "supertest";
import express, {Express} from "express";
import router from "../src/api/v1/routes/userRoutes";
import * as userController from "../src/api/v1/controller/userController"
import { HTTP_STATUS } from "../src/constants/httpConstants";

jest.mock("../src/api/v1/middleware/authenticate", () => ({
  __esModule: true,
  default: (req: any, res: any, next: any) => {
    req.user = { role: "manager" };
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
 
jest.mock("../src/api/v1/controller/userController")
 
const app: Express = express();
app.use(express.json());
app.use("/api/v1/users", router);
 
describe("User Routes", () => {
 
    afterEach(() => {
        jest.resetAllMocks();
    });
 
    describe("GET /api/v1/users", () => {
        it("should give all the users from the database", async () => {
 
            // Arrange
            (userController.getAllUsers as jest.Mock).mockImplementation(
                    (req, res) => res.status(200).json([])
            );
 
            // Act
            const res: Response = await request(app).get("/api/v1/users");
 
            // Assert
            expect(res.status).toBe(HTTP_STATUS.OK);
            expect(userController.getAllUsers).toHaveBeenCalled();
            });
    });
 
    describe("POST /api/v1/users", () => {
        it("should create user information in the database", async () => {
           
            // Arrange and Act
            (userController.createUsers as jest.Mock).mockImplementation(
                    (req, res) => res.status(201).json([])
            );
            const res: Response = await request(app)
                .post("/api/v1/users")
                .send({
                    "username": "Prachi",
                    "password": "Prachi13",
                    "DOB": "2012-02-12",
                    "platform": ["Mobile"],
                    "createdAt": "20226-02-02"
                });
 
            // Assert
            expect(res.status).toBe(HTTP_STATUS.CREATED);
            expect(userController.createUsers).toHaveBeenCalled();
        });
    });
});