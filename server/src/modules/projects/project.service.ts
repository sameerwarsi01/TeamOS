
import mongoose from "mongoose";
import Project from "./project.model";
import WorkspaceMember from "../workspaces/workspace-member.model";
import type {
  CreateProjectInput,
  UpdateProjectInput,
} from "./project.validation";

// CHECK WORKSPACE MEMBERSHIP
const getMembership = async (
  workspaceId: string,
  userId: string
) => {
  const membership = await WorkspaceMember.findOne({
    workspaceId: new mongoose.Types.ObjectId(workspaceId),
    userId: new mongoose.Types.ObjectId(userId),
  });

  if (!membership) {
    throw new Error("Workspace not found or access denied");
  }

  return membership;
};

// CREATE PROJECT
export const createProject = async (
  workspaceId: string,
  userId: string,
  data: CreateProjectInput
) => {
  const membership = await getMembership(workspaceId, userId);

  if (!["owner", "admin"].includes(membership.role)) {
    throw new Error("Only workspace owners and admins can create projects");
  }

  const project = await Project.create({
    ...data,
    workspaceId: new mongoose.Types.ObjectId(workspaceId),
    createdBy: new mongoose.Types.ObjectId(userId),
  });

  return project;
};

// GET ALL WORKSPACE PROJECTS
export const getWorkspaceProjects = async (
  workspaceId: string,
  userId: string
) => {
  await getMembership(workspaceId, userId);

  const projects = await Project.find({
    workspaceId: new mongoose.Types.ObjectId(workspaceId),
  }).sort({ createdAt: -1 });

  return projects;
};

// GET PROJECT BY ID
export const getProjectById = async (
  projectId: string,
  userId: string
) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  await getMembership(project.workspaceId.toString(), userId);

  return project;
};

// UPDATE PROJECT
export const updateProject = async (
  projectId: string,
  userId: string,
  data: UpdateProjectInput
) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  const membership = await getMembership(
    project.workspaceId.toString(),
    userId
  );

  if (!["owner", "admin"].includes(membership.role)) {
    throw new Error("Only workspace owners and admins can update projects");
  }

  const updatedProject = await Project.findByIdAndUpdate(
    projectId,
    { $set: data },
    { new: true, runValidators: true }
  );

  return updatedProject;
};

// DELETE PROJECT
export const deleteProject = async (
  projectId: string,
  userId: string
) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  const membership = await getMembership(
    project.workspaceId.toString(),
    userId
  );

  if (!["owner", "admin"].includes(membership.role)) {
    throw new Error("Only workspace owners and admins can delete projects");
  }

  await Project.deleteOne({ _id: project._id });

  return { projectId: project._id };
};