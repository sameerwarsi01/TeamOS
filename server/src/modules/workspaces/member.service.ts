
import mongoose from "mongoose";

import WorkspaceMember from "./workspace-member.model";

import type { updateMemberRoleInput } from "./member.validation";

// GET ALL MEMBERS OF A WORKSPACE
export const getWorkspaceMembers = async (
  workspaceId: string,
  userId: string
) => {
  const currentMembership = await WorkspaceMember.findOne({
    workspaceId: new mongoose.Types.ObjectId(workspaceId),
    userId: new mongoose.Types.ObjectId(userId),
  });

  if (!currentMembership) {
    throw new Error("Workspace not found or access denied");
  }

  const members = await WorkspaceMember.find({
    workspaceId: new mongoose.Types.ObjectId(workspaceId),
  })
    .populate({
      path: "userId",
      select: "name email avatar",
    })
    .sort({ joinedAt: 1 });

  return members;
};

// UPDATE WORKSPACE MEMBER ROLE
export const updateWorkspaceMemberRole = async (
  workspaceId: string,
  memberId: string,
  userId: string,
  data: updateMemberRoleInput
) => {
  // Step 1: Check current user's membership
  const currentMembership = await WorkspaceMember.findOne({
    workspaceId: new mongoose.Types.ObjectId(workspaceId),
    userId: new mongoose.Types.ObjectId(userId),
  });

  if (!currentMembership) {
    throw new Error("Workspace not found or access denied");
  }

  // Step 2: Only owner and admin can change roles
  if (!["owner", "admin"].includes(currentMembership.role)) {
    throw new Error("You do not have permission to change member roles");
  }

  // Step 3: Find target member in the same workspace
  const targetMember = await WorkspaceMember.findOne({
    _id: new mongoose.Types.ObjectId(memberId),
    workspaceId: new mongoose.Types.ObjectId(workspaceId),
  });

  if (!targetMember) {
    throw new Error("Workspace member not found");
  }

  // Step 4: Owner's role cannot be changed
  if (targetMember.role === "owner") {
    throw new Error("Workspace owner's role cannot be changed");
  }

  // Step 5: Admin cannot change another admin's role
  if (
    currentMembership.role === "admin" &&
    targetMember.role !== "member"
  ) {
    throw new Error("Admin can only change member roles");
  }

  // Step 6: Update target member's role
  targetMember.role = data.role;
  await targetMember.save();

  return targetMember.populate({
    path: "userId",
    select: "name email avatar",
  });
};


// REMOVE MEMBER FROM WORKSPACE
export const removeWorkspaceMember = async (
  workspaceId: string,
  memberId: string,
  userId: string
) => {
  const currentMembership = await WorkspaceMember.findOne({
    workspaceId: new mongoose.Types.ObjectId(workspaceId),
    userId: new mongoose.Types.ObjectId(userId),
  });

  if (!currentMembership) {
    throw new Error("Workspace not found or access denied");
  }

  // Only owner and admin can remove members
  if (!["owner", "admin"].includes(currentMembership.role)) {
    throw new Error("You do not have permission to remove members");
  }

  const targetMember = await WorkspaceMember.findOne({
    _id: new mongoose.Types.ObjectId(memberId),
    workspaceId: new mongoose.Types.ObjectId(workspaceId),
  });

  if (!targetMember) {
    throw new Error("Workspace member not found");
  }

  // Owner cannot be removed
  if (targetMember.role === "owner") {
    throw new Error("Workspace owner cannot be removed");
  }

  // Admin can remove only members, not other admins
  if (
    currentMembership.role === "admin" &&
    targetMember.role !== "member"
  ) {
    throw new Error("Admin can only remove workspace members");
  }

  // Prevent removing yourself
  if (targetMember.userId.toString() === userId) {
    throw new Error("You cannot remove yourself from the workspace");
  }

  await WorkspaceMember.deleteOne({
    _id: targetMember._id,
  });

  return {
    memberId: targetMember._id,
    userId: targetMember.userId,
  };
};