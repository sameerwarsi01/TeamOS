import { Router } from "express";

import { getCurrentUser } from "./user.controller";
import { authenticateUser } from "../../middleware/auth.middleware";

const router = Router();

// Protected User Profile Route
router.get("/me", authenticateUser, getCurrentUser);

export default router;