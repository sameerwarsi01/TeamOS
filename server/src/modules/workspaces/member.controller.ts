
import { Request, Response, NextFunction } from "express";

import {
  getWorkspaceMembers,
  updateWorkspaceMemberRole,
  removeWorkspaceMember,
} from "./member.service";

import { updateMemberRoleSchema } from "./member.validation";

// GET WORKSPACE MEMBERS
export const getWorkspaceMembersController = async (
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

    const members = await getWorkspaceMembers(
      workspaceId,
      userId
    );

    return res.status(200).json({
      success: true,
      message: "Workspace members fetched successfully",
      data: members,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE WORKSPACE MEMBER ROLE
export const updateWorkspaceMemberRoleController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const workspaceId = req.params.workspaceId;
    const memberId = req.params.memberId;

    if (
      typeof workspaceId !== "string" ||
      typeof memberId !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid workspace or member ID",
      });
    }

    const userId = res.locals.userId as string;

    const validatedData = updateMemberRoleSchema.parse(req.body);

    const updatedMember = await updateWorkspaceMemberRole(
      workspaceId,
      memberId,
      userId,
      validatedData
    );

    return res.status(200).json({
      success: true,
      message: "Member role updated successfully",
      data: updatedMember,
    });
  } catch (error) {
    next(error);
  }
};

export const removeWorkspaceMemberController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const workspaceId = req.params.workspaceId;
    const memberId = req.params.memberId;

    if (
      typeof workspaceId !== "string" ||
      typeof memberId !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid workspace or member ID",
      });
    }

    const userId = res.locals.userId as string;

    const result = await removeWorkspaceMember(
      workspaceId,
      memberId,
      userId
    );

    return res.status(200).json({
      success: true,
      message: "Member removed successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
