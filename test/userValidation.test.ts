import { Request, Response, NextFunction } from "express";
import { validateRequest } from "../src/api/v1/middleware/validateRequest";
import Joi from "joi";

describe("validateRequest Middleware", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockReq = {
            body: {},
            params: {},
            query: {},
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            locals: {},
        };
        mockNext = jest.fn();
    });

    it("should pass for valid body input", () => {
        const testSchemas = {
            body: Joi.object({
                username: Joi.string().min(3).required(),
                password: Joi.string().min(5).required(),
                DOB: Joi.date().less("now").required(),
                platform: Joi.array().required().items(Joi.string().valid("PC", "PlayStation", "Mobile", "X-Box"))
            }),
        };
        mockReq.body = {
            username: "Prachi",
            password: "Prachi13",
            DOB: "2012-09-09",
            platform: ["PC"] };
        const middleware = validateRequest(testSchemas);

        middleware(mockReq as Request, mockRes as Response, mockNext);

        expect(mockNext).toHaveBeenCalled();
        expect(mockRes.status).not.toHaveBeenCalled();
        expect(mockRes.json).not.toHaveBeenCalled();
    });

    it("should fail for invalid body input", () => {
        const testSchemas = {
            body: Joi.object({
                username: Joi.string().min(3).required(),
                password: Joi.string().min(5).required(),
                DOB: Joi.date().less("now").required(),
                platform: Joi.array().required().items(Joi.string().valid("PC", "PlayStation", "Mobile", "X-Box"))
            }),
        };
        mockReq.body = {password: "Prachi13", DOB: "2012-09-09", platform: ["Mobile"] };
        const middleware = validateRequest(testSchemas);

        middleware(mockReq as Request, mockRes as Response, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: 'Validation error(s): Body: "username" is required',
        });
        expect(mockNext).not.toHaveBeenCalled();
    });

    it("should validate params correctly", () => {
        const testSchemas = {
            params: Joi.object({
                id: Joi.string().required(),
            }),
        };
        mockReq.params = { id: "user00002" };
        const middleware = validateRequest(testSchemas);

        middleware(mockReq as Request, mockRes as Response, mockNext);

        expect(mockNext).toHaveBeenCalled();
    });

    it("should validate multiple request parts together", () => {
        const testSchemas = {
            params: Joi.object({
                id: Joi.string().required(),
            }),
            body: Joi.object({
                username: Joi.string().min(3).required(),
                password: Joi.string().min(5).required()
            })
        };
        mockReq.params = { id: "user00002" };
        mockReq.body = { username: "Prachi", password: "Prachi13" };
        const middleware = validateRequest(testSchemas);

        middleware(mockReq as Request, mockRes as Response, mockNext);

        expect(mockNext).toHaveBeenCalled();
    });
});