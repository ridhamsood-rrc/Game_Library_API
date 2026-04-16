import { subscriptionMiddleware } from "../src/api/v1/middleware/subscriptionMiddleware";
import * as userRepo from "../src/api/v1/repository/userFirestoreRepository";

jest.mock("../src/api/v1/repository/userFirestoreRepository");

describe("subscriptionMiddleware", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should set subscription in res.locals and call next", async () => {
        // Arrange
        const req = {} as any;

        const res = {
            locals: {
                uid: "user123"
            }
        } as any;

        const next = jest.fn();

        const mockUser = {
            userId: "user123",
            subscription: "premium"
        };

        (userRepo.getUserById as jest.Mock).mockResolvedValue(mockUser);

        // Act
        await subscriptionMiddleware(req, res, next);

        // Assert
        expect(userRepo.getUserById).toHaveBeenCalledWith("user123");
        expect(res.locals.subscription).toBe("premium");
        expect(next).toHaveBeenCalled();
    });

    it("should call next with error if user is not found", async () => {
        // Arrange
        const req = {} as any;

        const res = {
            locals: {
                uid: "user123"
            }
        } as any;

        const next = jest.fn();

        (userRepo.getUserById as jest.Mock).mockResolvedValue(null);

        // Act
        await subscriptionMiddleware(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should pass error to next if repository throws", async () => {
        // Arrange
        const req = {} as any;

        const res = {
            locals: {
                uid: "user123"
            }
        } as any;

        const next = jest.fn();

        (userRepo.getUserById as jest.Mock).mockRejectedValue(
            new Error("Database error")
        );

        // Act
        await subscriptionMiddleware(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
});