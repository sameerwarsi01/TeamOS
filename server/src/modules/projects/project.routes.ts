
import { Router } from "express";

import { authenticateUser } from "../../middleware/auth.middleware";

import {
  createProjectController,
  getWorkspaceProjectsController,
  getProjectByIdController,
  updateProjectController,
  deleteProjectController,
} from "./project.controller";

const router = Router();

// All Project routes require authentication
router.use(authenticateUser);

// Workspace Project Routes
router.post(
  "/workspaces/:workspaceId/projects",
  createProjectController
);

router.get(
  "/workspaces/:workspaceId/projects",
  getWorkspaceProjectsController
);

// Individual Project Routes
router.get(
  "/projects/:projectId",
  getProjectByIdController
);

router.patch(
  "/projects/:projectId",
  updateProjectController
);

router.delete(
  "/projects/:projectId",
  deleteProjectController
);

export default router;