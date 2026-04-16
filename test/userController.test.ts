import express, { Request, Response, NextFunction, Express } from 'express';
import * as userController from '../src/api/v1/controller/userController';
import * as userService from '../src/api/v1/services/userService';
import { HTTP_STATUS } from '../src/constants/httpConstants';
import router from '../src/api/v1/routes/userRoutes';

// Mock the service module
jest.mock('../src/api/v1/services/userService');

const app: Express = express();
app.use(express.json());
app.use("api/v1/users", router)

describe('Controller Name', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = {
      params: {},
      body: {},
      query: {}
    };
    mockRes = {
      locals: {
        uid: "user_id"
      },
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
    mockNext = jest.fn();
  });

  describe('controllerMethod', () => {
    it('should handle successful operation', async () => {
      // Arrange
      mockReq.body = {
        username: "Prachi",
        DOB: "2012-09-09",
        subscription: "free",
        platform: ["PC", "Mobile"]
      }

      const valid_user = {
        id: "user00002",
        ...mockReq.body
      };
      (userService.createUsers as jest.Mock).mockResolvedValue(valid_user);

      // Act
      await userController.createUsers(mockReq as Request, mockRes as Response, mockNext);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "User created successfully",
        data: valid_user
      });
    });
  });
});