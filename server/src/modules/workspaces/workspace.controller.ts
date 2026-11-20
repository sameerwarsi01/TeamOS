
import type { Request, Response, NextFunction } from "express";

import {
  createWorkspace,
  getMyWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
} from "./workspace.service";

import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
} from "./workspace.validation";

// CREATE WORKSPACE
export const createWorkspaceController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.userId;

    const validatedData = createWorkspaceSchema.parse(req.body);

    const workspace = await createWorkspace(userId, validatedData);

    return res.status(201).json({
      success: true,
      message: "Workspace created successfully",
      data: workspace,
    });
  } catch (error) {
    next(error);
  }
};

// GET ALL MY WORKSPACES
export const getMyWorkspacesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.userId;

    const workspaces = await getMyWorkspaces(userId);

    return res.status(200).json({
      success: true,
      data: workspaces,
    });
  } catch (error) {
    next(error);
  }
};

// GET SINGLE WORKSPACE
export const getWorkspaceByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.userId;
    const workspaceId = req.params.workspaceId;

    if (typeof workspaceId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid workspace ID",
      });
    }

    const workspace = await getWorkspaceById(workspaceId, userId);

    return res.status(200).json({
      success: true,
      data: workspace,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE WORKSPACE
export const updateWorkspaceController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.userId;
    const workspaceId = req.params.workspaceId;

    if (typeof workspaceId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid workspace ID",
      });
    }

    const validatedData = updateWorkspaceSchema.parse(req.body);

    const workspace = await updateWorkspace(
      workspaceId,
      userId,
      validatedData
    );

    return res.status(200).json({
      success: true,
      message: "Workspace updated successfully",
      data: workspace,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE WORKSPACE
export const deleteWorkspaceController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = res.locals.userId;
    const workspaceId = req.params.workspaceId;

    if (typeof workspaceId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid workspace ID",
      });
    }

    const result = await deleteWorkspace(workspaceId, userId);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};