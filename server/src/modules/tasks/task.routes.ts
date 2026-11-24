import { Router } from "express";

import { authenticateUser } from "../../middleware/auth.middleware";

import {
  createTaskController,
  getWorkspaceTasksController,
  getProjectTasksController,
  getTaskByIdController,
  updateTaskController,
  deleteTaskController,
} from "./task.controller";

const router = Router();

router.use(authenticateUser);

// Create task inside a project
router.post(
  "/workspaces/:workspaceId/projects/:projectId/tasks",
  createTaskController
);

// Get all tasks of a workspace
router.get(
  "/workspaces/:workspaceId/tasks",
  getWorkspaceTasksController
);

// Get all tasks of a project
router.get(
  "/projects/:projectId/tasks",
  getProjectTasksController
);

// Get single task
router.get("/tasks/:taskId", getTaskByIdController);

// Update task
router.patch("/tasks/:taskId", updateTaskController);

// Delete task
router.delete("/tasks/:taskId", deleteTaskController);

export default router;