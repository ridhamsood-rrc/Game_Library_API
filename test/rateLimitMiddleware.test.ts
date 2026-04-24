import rateLimit from "express-rate-limit";
import { rateLimitBySubscription } from "../src/api/v1/middleware/rateLimitingMiddleware";

jest.mock("express-rate-limit", () =>
    jest.fn(() => "mocked-rate-limit-middleware")
);

describe("rateLimitBySubscription", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should configure rate limiter correctly", () => {
        const middleware = rateLimitBySubscription(1);

        expect(rateLimit).toHaveBeenCalledTimes(1);
        expect(middleware).toBe("mocked-rate-limit-middleware");

        const config = (rateLimit as jest.Mock).mock.calls[0][0];

        expect(config.windowMs).toBe(60 * 1000 * 2);

        expect(config.message).toEqual({
            error: "Rate Limit reached",
            upgrade: "Upgrade to premium to get access to all the endpoints in the library."
        });
    });

    it("should return free limit (5) when multiplier is 1", () => {
        rateLimitBySubscription(1);
        const config = (rateLimit as jest.Mock).mock.calls[0][0];

        const req = {} as any;
        const res = {
            locals: { subscription: "free" }
        } as any;

        const result = config.max(req, res);

        expect(result).toBe(5);
    });

    it("should apply multiplier correctly for free users", () => {
        rateLimitBySubscription(0.5);
        const config = (rateLimit as jest.Mock).mock.calls[0][0];

        const req = {} as any;
        const res = {
            locals: { subscription: "free" }
        } as any;

        const result = config.max(req, res);

        expect(result).toBe(2); // floor(5 * 0.5)
    });

    it("should return premium limit (100) regardless of multiplier", () => {
        rateLimitBySubscription(0.2);
        const config = (rateLimit as jest.Mock).mock.calls[0][0];

        const req = {} as any;
        const res = {
            locals: { subscription: "premium" }
        } as any;

        const result = config.max(req, res);

        expect(result).toBe(100);
    });

    it("should generate key using uid", () => {
        rateLimitBySubscription(1);
        const config = (rateLimit as jest.Mock).mock.calls[0][0];

        const req = {} as any;
        const res = {
            locals: { uid: "user123" }
        } as any;

        const result = config.keyGenerator(req, res);

        expect(result).toBe("user-user123");
    });
});