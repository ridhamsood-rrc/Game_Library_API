import rateLimit from "express-rate-limit";
import { rateLimitBySubscription } from "../src/api/v1/middleware/rateLimitingMiddleware";

jest.mock("express-rate-limit", () => jest.fn(() => "mocked-rate-limit-middleware"));

describe("rateLimitBySubscription", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should configure rate limiter with free and premium subscription logic", () => {
        // ArrangeW

        // Act
        const middleware = rateLimitBySubscription();

        // Assert
        expect(rateLimit).toHaveBeenCalledTimes(1);
        expect(middleware).toBe("mocked-rate-limit-middleware");

        const config = (rateLimit as jest.Mock).mock.calls[0][0];

        expect(config.windowMs).toBe(60 * 1000);
        expect(config.message).toEqual({
            error: "Rate Limit reached",
            upgrade: "Upgrade to premium to get access to all the games in the library."
        });
    });

    it("should return free limit for free users", () => {
        // Arrange
        rateLimitBySubscription();
        const config = (rateLimit as jest.Mock).mock.calls[0][0];

        const req = {} as any;
        const res = {
            locals: {
                subscription: "free"
            }
        } as any;

        // Act
        const result = config.max(req, res);

        // Assert
        expect(result).toBe(5);
    });

    it("should return premium limit for premium users", () => {
        // Arrange
        rateLimitBySubscription();
        const config = (rateLimit as jest.Mock).mock.calls[0][0];

        const req = {} as any;
        const res = {
            locals: {
                subscription: "premium"
            }
        } as any;

        // Act
        const result = config.max(req, res);

        // Assert
        expect(result).toBe(100);
    });

    it("should generate key using res.locals.uid", () => {
        // Arrange
        rateLimitBySubscription();
        const config = (rateLimit as jest.Mock).mock.calls[0][0];

        const req = {} as any;
        const res = {
            locals: {
                uid: "user123"
            }
        } as any;

        // Act
        const result = config.keyGenerator(req, res);

        // Assert
        expect(result).toBe("ip-user123");
    });
});