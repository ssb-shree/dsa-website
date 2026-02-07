import { Router } from "express";

const router = Router();

import { getUserAuthenticated, loginController } from "../controllers/auth.controller";
import { checkAuth } from "../middlewares/auth.middleware";

// login
router.post("/login", loginController);

// authUSer
router.get("/check", checkAuth, getUserAuthenticated);

export default router;
