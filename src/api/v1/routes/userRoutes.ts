import { Router } from "express";
import * as userController from "../controller/userController";
import { createUserSchema } from "../validate/userValidation";
import { validateRequest } from "../middleware/validateRequest";

const router = Router();

router.get("/users", userController.getAllUsers);

router.post("/users",
    validateRequest({ body: createUserSchema}),
    userController.createUsers);

export default router