import { Router } from "express";
import * as userController from "../controller/userController";
import { createUserSchema, updateUserSchema } from "../validate/userValidation";
import { validateRequest } from "../middleware/validateRequest";

const router = Router();

router.get("/", userController.getAllUsers);

router.get("/:id", userController.getUsersById);

router.post("/",
    validateRequest({ body: createUserSchema}),
    userController.createUsers);

router.put("/:id",
    validateRequest(updateUserSchema),
    userController.updateUser);

router.delete("/:id", userController.deleteUser);

export default router