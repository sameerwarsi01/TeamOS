import { Router } from "express";

import {
    registerController,
    loginController,
    refreshTokenController,
    logoutController,
} from "./auth.controller";

const router = Router();

// Register router
router.post("/register", registerController);

// Login route
router.post("/login", loginController);

// Refresh Token Route
router.post("/refresh", refreshTokenController);

// Logout Route
router.post("/logout", logoutController);

export default router;