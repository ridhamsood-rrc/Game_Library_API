import express, { Router } from "express";
import * as gameController from "../controllers/gameController";
import { validateRequest } from "../middleware/validate";
import { itemSchemas } from "../validation/gameValidation";

const router: Router = express.Router();

router.get("/", gameController.getGames);

router.get("/:id",
    validateRequest(itemSchemas.getGameById),
    gameController.getGameById);

router.post("/",
    validateRequest(itemSchemas.create),
    gameController.createGame);

router.put("/:id",
    validateRequest(itemSchemas.updateGame),
    gameController.updateGame);

router.delete("/:id",
    validateRequest(itemSchemas.deleteGame),
    gameController.deleteGame
)

export default router