
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

import {
  getWorkspaceMembersController,
  updateWorkspaceMemberRoleController,
  removeWorkspaceMemberController,
} from "./member.controller";

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

// Member routes
router.get(
  "/:workspaceId/members",
  getWorkspaceMembersController
);

router.patch(
  "/:workspaceId/members/:memberId/role",
  updateWorkspaceMemberRoleController
);

router.delete(
  "/:workspaceId/members/:memberId",
  removeWorkspaceMemberController
);

export default router;