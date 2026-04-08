import { Request, Response, NextFunction } from "express";
import { validateRequest } from "../src/api/v1/middleware/validate";
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
                name: Joi.string().min(5).max(50).required(),
                genre: Joi.string().required().valid("Shooting", "Open-World", "Sports", "Simulation", "Action"),
                developedBy: Joi.string().required(),
                size: Joi.string().required(),
                platform: Joi.string().required().valid("PC", "PlayStation", "X-Box", "Mobile"),
            })
        };
        mockReq.body = { 
            "name": "Critical Ops",
            "genre": "Shooting",
            "developedBy": "John",
            "size": "700MB",
            "platform": "Mobile"
         };
        const middleware = validateRequest(testSchemas);

        middleware(mockReq as Request, mockRes as Response, mockNext);

        expect(mockNext).toHaveBeenCalled();
        expect(mockRes.status).not.toHaveBeenCalled();
        expect(mockRes.json).not.toHaveBeenCalled();
    });

    it("should fail for invalid name", () => {
        const testSchemas = {
            body: Joi.object({
                name: Joi.string().min(5).max(50).required(),
                genre: Joi.string().required().valid("Shooting", "Open-World", "Sports", "Simulation", "Action"),
                developedBy: Joi.string().required(),
                size: Joi.string().required(),
                platform: Joi.string().required().valid("PC", "PlayStation", "X-Box", "Mobile"),
            })
        };
        mockReq.body = { 
            "name": "Cri",
            "genre": "Shooting",
            "developedBy": "John",
            "size": "700MB",
            "platform": "Mobile"
         };
        const middleware = validateRequest(testSchemas);

        middleware(mockReq as Request, mockRes as Response, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: 'Validation error: "name" length must be at least 5 characters long',
        });
        expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail for invalid genre", () => {
        const testSchemas = {
            body: Joi.object({
                name: Joi.string().min(5).max(50).required(),
                genre: Joi.string().required().valid("Shooting", "Open-World", "Sports", "Simulation", "Action"),
                developedBy: Joi.string().required(),
                size: Joi.string().required(),
                platform: Joi.string().required().valid("PC", "PlayStation", "X-Box", "Mobile"),
            }),
        };
        mockReq.body = { 
            "name": "Critical Ops",
            "genre": "Driving",
            "developedBy": "John",
            "size": "700MB",
            "platform": "Mobile"
         };
        const middleware = validateRequest(testSchemas);

        middleware(mockReq as Request, mockRes as Response, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: 'Validation error: "genre" must be one of [Shooting, Open-World, Sports, Simulation, Action]',
        });
        expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail for invalid size", () => {
        const testSchemas = {
            body: Joi.object({
                name: Joi.string().min(5).max(50).required(),
                genre: Joi.string().required().valid("Shooting", "Open-World", "Sports", "Simulation", "Action"),
                developedBy: Joi.string().required(),
                size: Joi.string().required(),
                platform: Joi.string().required().valid("PC", "PlayStation", "X-Box", "Mobile"),
            }),
        };
        mockReq.body = { 
            "name": "Critical Ops",
            "genre": "Shooting",
            "developedBy": "John",
            "size": 700,
            "platform": "Mobile"
        };
        const middleware = validateRequest(testSchemas);

        middleware(mockReq as Request, mockRes as Response, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: 'Validation error: "size" must be a string',
        });
        expect(mockNext).not.toHaveBeenCalled();
    });
    
    it("should validate params correctly", () => {
        const testSchemas = {
            params: Joi.object({
                id: Joi.string().required(),
            }),
        };
        mockReq.params = { id: "1" };
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
                name: Joi.string().min(5),
            })
        };
        mockReq.params = { id: "3" };
        mockReq.body = { name: "Updated Game" };
        const middleware = validateRequest(testSchemas);

        middleware(mockReq as Request, mockRes as Response, mockNext);

        expect(mockNext).toHaveBeenCalled();
    });
});