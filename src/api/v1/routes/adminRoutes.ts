import express, { Router } from "express";
import { setCustomClaims } from "../controllers/adminController";

const router: Router = express.Router()

router.post("/setCustomClaims",
    setCustomClaims
)

export default router;