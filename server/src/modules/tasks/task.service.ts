import mongoose from "mongoose";
import Task from "./task.model";
import Project from "../projects/project.model";
import WorkspaceMember from "../workspaces/workspace-member.model";

import type {
  CreateTaskInput,
  UpdateTaskInput,
} from "./task.validation";

const getMembership = async (workspaceId: string, userId: string) => {
  if (
    !mongoose.isValidObjectId(workspaceId) ||
    !mongoose.isValidObjectId(userId)
  ) {
    throw new Error("Workspace not found or access denied");
  }

  const membership = await WorkspaceMember.findOne({
    workspaceId: new mongoose.Types.ObjectId(workspaceId),
    userId: new mongoose.Types.ObjectId(userId),
  });

  if (!membership) {
    throw new Error("Workspace not found or access denied");
  }

  return membership;
};

export const createTask = async (
  workspaceId: string,
  projectId: string,
  userId: string,
  data: CreateTaskInput
) => {
  const membership = await getMembership(workspaceId, userId);

  if (!["owner", "admin"].includes(membership.role)) {
    throw new Error("Only workspace owners and admins can create tasks");
  }

  if (!mongoose.isValidObjectId(projectId)) {
    throw new Error("Project not found");
  }

  const project = await Project.findOne({
    _id: projectId,
    workspaceId,
  });

  if (!project) {
    throw new Error("Project not found in this workspace");
  }

  if (data.assignedTo) {
    const assigneeMembership = await WorkspaceMember.findOne({
      workspaceId,
      userId: data.assignedTo,
    });

    if (!assigneeMembership) {
      throw new Error("Assigned user must be a workspace member");
    }
  }

  const task = await Task.create({
    ...data,
    workspaceId: new mongoose.Types.ObjectId(workspaceId),
    projectId: new mongoose.Types.ObjectId(projectId),
    createdBy: new mongoose.Types.ObjectId(userId),
    ...(data.assignedTo && {
      assignedTo: new mongoose.Types.ObjectId(data.assignedTo),
    }),
  });

  return task;
};


export const getWorkspaceTasks = async (
  workspaceId: string,
  userId: string
) => {
  await getMembership(workspaceId, userId);

  const tasks = await Task.find({
    workspaceId: new mongoose.Types.ObjectId(workspaceId),
  })
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email")
    .populate("projectId", "name status")
    .sort({ createdAt: -1 });

  return tasks;
};

export const getProjectTasks = async (
  projectId: string,
  userId: string
) => {
  if (!mongoose.isValidObjectId(projectId)) {
    throw new Error("Project not found");
  }

  const project = await Project.findById(projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  await getMembership(project.workspaceId.toString(), userId);

  const tasks = await Task.find({
    projectId: new mongoose.Types.ObjectId(projectId),
  })
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email")
    .populate("projectId", "name status")
    .sort({ createdAt: -1 });

  return tasks;
};

export const getTaskById = async (
  taskId: string,
  userId: string
) => {
  if (!mongoose.isValidObjectId(taskId)) {
    throw new Error("Task not found");
  }

  const task = await Task.findById(taskId)
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email")
    .populate("projectId", "name status");

  if (!task) {
    throw new Error("Task not found");
  }

  await getMembership(task.workspaceId.toString(), userId);

  return task;
};

export const updateTask = async (
  taskId: string,
  userId: string,
  data: UpdateTaskInput
) => {
  if (!mongoose.isValidObjectId(taskId)) {
    throw new Error("Task not found");
  }

  const task = await Task.findById(taskId);

  if (!task) {
    throw new Error("Task not found");
  }

  const membership = await getMembership(
    task.workspaceId.toString(),
    userId
  );

  const isOwnerOrAdmin = ["owner", "admin"].includes(membership.role);
  const isAssignee = task.assignedTo?.toString() === userId;

  if (!isOwnerOrAdmin && !isAssignee) {
    throw new Error("You are not allowed to update this task");
  }

  if (data.assignedTo) {
    const assigneeMembership = await WorkspaceMember.findOne({
      workspaceId: task.workspaceId,
      userId: data.assignedTo,
    });

    if (!assigneeMembership) {
      throw new Error("Assigned user must be a workspace member");
    }
  }

  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    { $set: data },
    { new: true, runValidators: true }
  )
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email")
    .populate("projectId", "name status");

  return updatedTask;
};

export const deleteTask = async (
  taskId: string,
  userId: string
) => {
  if (!mongoose.isValidObjectId(taskId)) {
    throw new Error("Task not found");
  }

  const task = await Task.findById(taskId);

  if (!task) {
    throw new Error("Task not found");
  }

  const membership = await getMembership(
    task.workspaceId.toString(),
    userId
  );

  if (!["owner", "admin"].includes(membership.role)) {
    throw new Error("Only workspace owners and admins can delete tasks");
  }

  await Task.deleteOne({ _id: task._id });

  return { taskId: task._id };
};