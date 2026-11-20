
import mongoose from "mongoose";
import { createHash, randomBytes } from "crypto";

import Invitation from "./invitation.model";
import WorkspaceMember from "./workspace-member.model";
import Workspace from "./workspace.model";
import User from "../users/user.model";

import type { CreateInvitationInput } from "./invitation.validation";

// Create Invitation
export const createInvitation = async (
  workspaceId: string,
  userId: string,
  data: CreateInvitationInput
) => {
  // 1. Check whether workspace exists
  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  // 2. Check inviter's workspace role
  const inviterMembership = await WorkspaceMember.findOne({
    workspaceId,
    userId,
  });

  if (
    !inviterMembership ||
    !["owner", "admin"].includes(inviterMembership.role)
  ) {
    throw new Error("You are not allowed to invite members");
  }

  // 3. Check whether user is already a member
  const existingUser = await User.findOne({
    email: data.email,
  });

  if (existingUser) {
    const existingMembership = await WorkspaceMember.findOne({
      workspaceId,
      userId: existingUser._id,
    });

    if (existingMembership) {
      throw new Error("This user is already a workspace member");
    }
  }

  // 4. Check existing pending invitation
  const existingInvitation = await Invitation.findOne({
    workspaceId,
    email: data.email,
    status: "pending",
  });

  if (existingInvitation) {
    if (existingInvitation.expiresAt > new Date()) {
      throw new Error(
        "An invitation is already pending for this email"
      );
    }

    existingInvitation.status = "expired";
    await existingInvitation.save();
  }

  // 5. Generate secure random token
  const rawToken = randomBytes(32).toString("hex");

  // 6. Hash token before storing
  const tokenHash = createHash("sha256")
    .update(rawToken)
    .digest("hex");

  // 7. Set expiry to 7 days
  const expiresAt = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  );

  // 8. Create invitation
  const invitation = await Invitation.create({
    workspaceId,
    email: data.email,
    role: data.role,
    invitedBy: userId,
    tokenHash,
    expiresAt,
  });

  return {
    invitation,
    token: rawToken,
  };
};

// Accept Invitation
export const acceptInvitation = async (
  userId: string,
  rawToken: string
): Promise<{ workspaceId: string; role: string }> => {
  const session = await mongoose.startSession();

  try {
    let result: {
      workspaceId: string;
      role: string;
    } | null = null;

    await session.withTransaction(async () => {
      // 1. Hash received token
      const tokenHash = createHash("sha256")
        .update(rawToken)
        .digest("hex");

      // 2. Find pending invitation
      const invitation = await Invitation.findOne({
        tokenHash,
        status: "pending",
      })
        .select("+tokenHash")
        .session(session);

      if (!invitation) {
        throw new Error("Invalid or unavailable invitation");
      }

      // 3. Check expiry
      if (invitation.expiresAt <= new Date()) {
        throw new Error("Invitation has expired");
      }

      // 4. Find logged-in user
      const user = await User.findById(userId).session(session);

      if (!user) {
        throw new Error("User not found");
      }

      // 5. Verify invited email
      if (
        user.email.toLowerCase() !==
        invitation.email.toLowerCase()
      ) {
        throw new Error(
          "This invitation was sent to a different email address"
        );
      }

      // 6. Check workspace
      const workspace = await Workspace.findById(
        invitation.workspaceId
      ).session(session);

      if (!workspace) {
        throw new Error("Workspace no longer exists");
      }

      // 7. Check existing membership
      const existingMembership = await WorkspaceMember.findOne({
        workspaceId: invitation.workspaceId,
        userId,
      }).session(session);

      if (existingMembership) {
        throw new Error("You are already a workspace member");
      }

      // 8. Add user to workspace
      await WorkspaceMember.create(
        [
          {
            workspaceId: invitation.workspaceId,
            userId,
            role: invitation.role,
          },
        ],
        { session }
      );

      // 9. Update invitation status
      invitation.status = "accepted";
      await invitation.save({ session });

      result = {
        workspaceId: invitation.workspaceId.toString(),
        role: invitation.role,
      };
    });

    if (!result) {
       throw new Error("Invitation could not be accepted");
    }

    return result;
  } finally {
    await session.endSession();
  }
};