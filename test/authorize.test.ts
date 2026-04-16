import isAuthorized from "../src/api/v1/middleware/authorize";
import { AuthorizationError } from "../src/api/v1/errors/errors";

describe("isAuthorized Middleware", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should allow access if user is accessing their own resource", () => {
        // Arrange
        const req = {
            params: { id: "user123" }
        } as any;

        const res = {
            locals: {
                uid: "user123",
                role: "user"
            }
        } as any;

        const next = jest.fn();

        const middleware = isAuthorized({
            allowSameUser: true,
            hasRole: []
        });

        // Act
        middleware(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledWith();
    });

    it("should allow access if user role is authorized", () => {
        // Arrange
        const req = {
            params: { id: "user456" }
        } as any;

        const res = {
            locals: {
                uid: "user123",
                role: "admin"
            }
        } as any;

        const next = jest.fn();

        const middleware = isAuthorized({
            allowSameUser: false,
            hasRole: ["admin"]
        });

        // Act
        middleware(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledWith();
    });

    it("should throw error if no role is found", () => {
        // Arrange
        const req = {
            params: { id: "user456" }
        } as any;

        const res = {
            locals: {
                uid: "user123"
            }
        } as any;

        const next = jest.fn();

        const middleware = isAuthorized({
            allowSameUser: false,
            hasRole: ["admin"]
        });

        // Act
        middleware(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledWith(expect.any(AuthorizationError));
    });

    it("should throw error if role is not authorized", () => {
        // Arrange
        const req = {
            params: { id: "user456" }
        } as any;

        const res = {
            locals: {
                uid: "user123",
                role: "user"
            }
        } as any;

        const next = jest.fn();

        const middleware = isAuthorized({
            allowSameUser: false,
            hasRole: ["admin"]
        });

        // Act
        middleware(req, res, next);

        // Assert
        expect(next).toHaveBeenCalledWith(expect.any(AuthorizationError));
    });
});