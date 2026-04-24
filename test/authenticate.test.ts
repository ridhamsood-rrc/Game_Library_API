import authenticate from "../src/api/v1/middleware/authenticate";
import { AuthenticationError } from "../src/api/v1/errors/errors";
import { auth } from "../config/firebaseConfig";

jest.mock("../config/firebaseConfig", () => ({
    auth: {
        verifyIdToken: jest.fn()
    }
}));

describe("authenticate middleware", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should set uid and role when token is valid", async () => {
        // Arrange
        const req = {
            headers: {
                authorization: "Bearer validToken"
            }
        } as any;

        const res = {
            locals: {}
        } as any;

        const next = jest.fn();

        (auth.verifyIdToken as jest.Mock).mockResolvedValue({
            uid: "user123",
            role: "freeUser"
        });

        // Act
        await authenticate(req, res, next);

        // Assert
        expect(auth.verifyIdToken).toHaveBeenCalledWith("validToken");
        expect(res.locals.uid).toBe("user123");
        expect(res.locals.role).toBe("freeUser");
        expect(next).toHaveBeenCalledWith();
    });

    it("should throw error if no token is provided", async () => {
        // Arrange
        const req = {
            headers: {}
        } as any;

        const res = {
            locals: {}
        } as any;

        const next = jest.fn();

        // Act
        await authenticate(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledWith(expect.any(AuthenticationError));
    });

    it("should handle invalid token using res.status and json", async () => {
        // Arrange
        const req = {
            headers: {
                authorization: "Bearer invalidToken"
            }
        } as any;

        const res = {
            locals: {},
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as any;

        const next = jest.fn();

        (auth.verifyIdToken as jest.Mock).mockRejectedValue(
            new Error("Invalid token")
        );

        // Act
        await authenticate(req, res, next);

        // Assert
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalled();
    });
});