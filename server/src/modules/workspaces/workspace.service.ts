
import mongoose from "mongoose";

import Workspace from "./workspace.model";
import WorkspaceMember from "./workspace-member.model";

import type { IWorkspace } from "./workspace.model";
import type { CreateWorkspaceInput } from "./workspace.validation";
import type { UpdateWorkspaceInput } from "./workspace.validation";

// CREATE WORKSPACE
export const createWorkspace = async (
  userId: string,
  data: CreateWorkspaceInput
): Promise<IWorkspace> => {
  const session = await mongoose.startSession();

  try {
    let createdWorkspace: IWorkspace | null = null;

    await session.withTransaction(async () => {
      // Step 1: Create workspace
      const [workspace] = await Workspace.create(
        [
          {
            name: data.name,
            description: data.description,
            createdBy: new mongoose.Types.ObjectId(userId),
          },
        ],
        { session }
      );

      // Step 2: Add creator as workspace owner
      await WorkspaceMember.create(
        [
          {
            workspaceId: workspace._id,
            userId: new mongoose.Types.ObjectId(userId),
            role: "owner",
          },
        ],
        { session }
      );

      createdWorkspace = workspace;
    });

    if (!createdWorkspace) {
      throw new Error("Workspace creation failed");
    }

    return createdWorkspace;
  } finally {
    await session.endSession();
  }
};

// GET ALL WORKSPACES OF LOGGED-IN USER
export const getMyWorkspaces = async (userId: string) => {
  const memberships = await WorkspaceMember.find({
    userId: new mongoose.Types.ObjectId(userId),
  })
    .populate("workspaceId")
    .sort({ createdAt: -1 });

  return memberships;
};

// GET SINGLE WORKSPACE BY ID
export const getWorkspaceById = async (
  workspaceId: string,
  userId: string
) => {
  const membership = await WorkspaceMember.findOne({
    workspaceId: new mongoose.Types.ObjectId(workspaceId),
    userId: new mongoose.Types.ObjectId(userId),
  }).populate<{ workspaceId: IWorkspace | null }>("workspaceId");

  if (!membership || !membership.workspaceId) {
    throw new Error("Workspace not found or access denied");
  }

  return membership.workspaceId;
};

// UPDATE WORKSPACE
export const updateWorkspace = async (
  workspaceId: string,
  userId: string,
  data: UpdateWorkspaceInput
) => {
  // Step 1: Check user's membership and role
  const membership = await WorkspaceMember.findOne({
    workspaceId: new mongoose.Types.ObjectId(workspaceId),
    userId: new mongoose.Types.ObjectId(userId),
  });

  if (!membership) {
    throw new Error("Workspace not found or access denied");
  }

  // Step 2: Check permission
  if (!["owner", "admin"].includes(membership.role)) {
    throw new Error("You do not have permission to update this workspace");
  }

  // Step 3: Update workspace
  const updatedWorkspace = await Workspace.findByIdAndUpdate(
    workspaceId,
    { $set: data },
    {
      returnDocument: "after",
      runValidators: true,
    }
  );

  if (!updatedWorkspace) {
    throw new Error("Workspace not found");
  }

  return updatedWorkspace;
};

// DELETE WORKSPACE
export const deleteWorkspace = async (
  workspaceId: string,
  userId: string
) => {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      // Step 1: Check workspace ownership
      const membership = await WorkspaceMember.findOne({
        workspaceId: new mongoose.Types.ObjectId(workspaceId),
        userId: new mongoose.Types.ObjectId(userId),
        role: "owner",
      }).session(session);

      if (!membership) {
        throw new Error(
          "Only the workspace owner can delete this workspace"
        );
      }

      // Step 2: Delete all workspace memberships
      await WorkspaceMember.deleteMany(
        { workspaceId: membership.workspaceId },
        { session }
      );

      // Step 3: Delete workspace
      await Workspace.findByIdAndDelete(workspaceId, { session });
    });

    return { message: "Workspace deleted successfully" };
  } finally {
    await session.endSession();
  }
};