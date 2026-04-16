import { Router } from "express";
import * as userController from "../controller/userController";
import { createUserSchema, updateUserSchema } from "../validate/userValidation";
import { validateRequest } from "../middleware/validateRequest";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";
import { subscriptionMiddleware } from "../middleware/subscriptionMiddleware";
import { rateLimitBySubscription } from "../middleware/rateLimitingMiddleware";

const router = Router();

// Get all users
/**
 * @openapi
 * /users:
 *   get:
 *     summary: Get all users information
 *     tags: [Users]
 *     description: Retrieve a list of users information
 *     responses:
 *       '200':
 *         description: Successfully retrieved all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  type: object
 *                  properties:
 *                    userId:
 *                      type: string
 *                      example: "user00001"
 *                    username:
 *                      type: string
 *                      example: "Prachi"
 *                    password:
 *                      type: string
 *                      example: "Prachi13"
 *                    DOB:
 *                      type: string
 *                      example: "2012-05-03"
 *                    platform:
 *                      type: array
 *                      example: ["PC", "Mobile"]
 *                    createdAt:
 *                      type: date
 *                      example: "2025-05-05T10:30:00Z"
 */
router.get("/",
    authenticate,
    isAuthorized({hasRole: ["manager"]}),
    userController.getAllUsers);

// Get user by id
/**
 * @openapi
 * /users/{userId}:
 *   get:
 *     summary: Get an user's information based on the userId
 *     tags: [Users]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the user
 *     responses:
 *       '200':
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetUserById'
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 */

router.get("/:id",
    authenticate,
    isAuthorized({hasRole: ["manager", "freeUser", "premiumUser"]}),
    subscriptionMiddleware,
    rateLimitBySubscription(),
    userController.getUsersById);

// Create User
/**
 * @openapi
 * /users:
 *   post:
 *     summary: Create a new user with required fields
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '201':
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/",
    validateRequest({ body: createUserSchema}),
    userController.createUsers);

// Update user
/**
 * @openapi
 * /users/{userId}:
 *   put:
 *     summary: Update an user's information based on userId
 *     tags: [Users]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUser'
 *     responses:
 *       '200':
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateUser'
 *       '400':
 *          description: Invalid input data
 *          content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 */
router.put("/:id",
    authenticate,
    isAuthorized({hasRole: ["manager", "freeUser", "premiumUser"]}),
    subscriptionMiddleware,
    rateLimitBySubscription(),
    validateRequest(updateUserSchema),
    userController.updateUser);

// Delete user
/**
 * @openapi
 * /users/{userId}:
 *   delete:
 *     summary: Delete an user's information based on user_id
 *     tags: [Users]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the user
 *     responses:
 *       '200':
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                      example: "User deleted successfully"
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 */
router.delete("/:id",
    authenticate,
    isAuthorized({hasRole: ["manager", "freeUser", "premiumUser"]}),
    subscriptionMiddleware,
    rateLimitBySubscription(),
    userController.deleteUser);

export default router