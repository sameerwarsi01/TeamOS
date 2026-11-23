import { Request, Response, NextFunction } from "express";

import {
  createProject,
  getWorkspaceProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "./project.service";

import {
  createProjectSchema,
  updateProjectSchema,
} from "./project.validation";
import { success } from "zod";

// Create Project
export const createProjectController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const workspaceId = req.params.workspaceId;

        if (typeof workspaceId !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid workspace ID",
            });
        }

        const userId = res.locals.userId as string;
        const validatedData = createProjectSchema.parse(req.body);

        const project = await createProject(
          workspaceId,
          userId,
          validatedData
        );

        return res.status(201).json({
            success: true,
            message: "Project created successfully",
            data: project,
        });
    } catch (error) {
        next(error);
    }
};

export const getWorkspaceProjectsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const workspaceId = req.params.workspaceId;

    if (typeof workspaceId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid workspace ID",
      });
    }

    const userId = res.locals.userId as string;

    const projects = await getWorkspaceProjects(
      workspaceId,
      userId
    );

    return res.status(200).json({
      success: true,
      message: "Workspace projects fetched successfully",
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

// GET PROJECT BY ID
export const getProjectByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const projectId = req.params.projectId;

    if (typeof projectId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    const userId = res.locals.userId as string;

    const project = await getProjectById(projectId, userId);

    return res.status(200).json({
      success: true,
      message: "Project fetched successfully",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE PROJECT
export const updateProjectController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const projectId = req.params.projectId;

    if (typeof projectId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    const userId = res.locals.userId as string;
    const validatedData = updateProjectSchema.parse(req.body);

    const project = await updateProject(
      projectId,
      userId,
      validatedData
    );

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE PROJECT
export const deleteProjectController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const projectId = req.params.projectId;

    if (typeof projectId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID",
      });
    }

    const userId = res.locals.userId as string;

    const result = await deleteProject(projectId, userId);

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};