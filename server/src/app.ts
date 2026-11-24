
import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";

import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/user.routes";
import workspaceRoutes from "./modules/workspaces/workspace.routes";
import ProjectRoutes from "./modules/projects/project.routes";
import taskRoutes from "./modules/tasks/task.routes";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health Check
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "TeamOS API is running",
  });
});

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/workspaces", workspaceRoutes);
app.use("/api/v1", ProjectRoutes);
app.use("/api/v1", taskRoutes);

export default app;
