
import { Request, Response, NextFunction } from "express";

import {
  createTask,
  getWorkspaceTasks,
  getProjectTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "./task.service";

import {
  createTaskSchema,
  updateTaskSchema,
} from "./task.validation";

const getRouteParam = (value: string | string[]): string => {
  return Array.isArray(value) ? value[0] : value;
};

// Create Task
export const createTaskController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = createTaskSchema.parse(req.body);

    const task = await createTask(
      getRouteParam(req.params.workspaceId),
      getRouteParam(req.params.projectId),
      res.locals.userId,
      validatedData
    );

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// Get Workspace Tasks
export const getWorkspaceTasksController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tasks = await getWorkspaceTasks(
      getRouteParam(req.params.workspaceId),
      res.locals.userId
    );

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

// Get Project Tasks
export const getProjectTasksController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tasks = await getProjectTasks(
      getRouteParam(req.params.projectId),
      res.locals.userId
    );

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

// Get Task By ID
export const getTaskByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const task = await getTaskById(
      getRouteParam(req.params.taskId),
      res.locals.userId
    );

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// Update Task
export const updateTaskController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = updateTaskSchema.parse(req.body);

    const task = await updateTask(
      getRouteParam(req.params.taskId),
      res.locals.userId,
      validatedData
    );

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Task
export const deleteTaskController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await deleteTask(
      getRouteParam(req.params.taskId),
      res.locals.userId
    );

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};