import express, { Router } from "express";
import { signIn } from "../controllers/signInController";

const router: Router = express.Router();

router.post("/auth/signIn",
    signIn
)

export default router;