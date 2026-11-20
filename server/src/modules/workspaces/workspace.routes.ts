
import { Router } from "express";

import {
  createWorkspaceController,
  getMyWorkspacesController,
  getWorkspaceByIdController,
  updateWorkspaceController,
  deleteWorkspaceController,
} from "./workspace.controller";

import {
  createInvitationController,
  acceptInvitationController,
} from "./invitation.controller";

import { authenticateUser } from "../../middleware/auth.middleware";

const router = Router();

// All workspace routes require authentication
router.use(authenticateUser);

// Accept invitation route
router.post("/invitations/accept", acceptInvitationController);

// Workspace routes
router.post("/", createWorkspaceController);
router.get("/", getMyWorkspacesController);
router.get("/:workspaceId", getWorkspaceByIdController);
router.patch("/:workspaceId", updateWorkspaceController);
router.delete("/:workspaceId", deleteWorkspaceController);

// Create invitation route
router.post(
  "/:workspaceId/invitations",
  createInvitationController
);

export default router;