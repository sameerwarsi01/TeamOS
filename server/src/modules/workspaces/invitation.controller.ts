
import { Request, Response, NextFunction } from "express";

import {
  createInvitationSchema,
  acceptInvitationSchema,
} from "./invitation.validation";

import {
  createInvitation,
  acceptInvitation,
} from "./invitation.service";

// Create Invitation Controller
export const createInvitationController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get workspace ID from route params
    const workspaceId = req.params.workspaceId;

    if (typeof workspaceId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid workspace ID",
      });
    }

    // Get logged-in user ID
    const userId = res.locals.userId as string;

    // Validate request body
    const validatedData = createInvitationSchema.parse(req.body);

    // Create invitation
    const { invitation, token } = await createInvitation(
      workspaceId,
      userId,
      validatedData
    );

    return res.status(201).json({
      success: true,
      message: "Invitation created successfully",
      data: {
        invitationId: invitation._id,
        email: invitation.email,
        role: invitation.role,
        status: invitation.status,
        expiresAt: invitation.expiresAt,

        // Expose token only in development
        ...(process.env.NODE_ENV !== "production" && {
          invitationToken: token,
        }),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Accept Invitation Controller
export const acceptInvitationController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get logged-in user ID
    const userId = res.locals.userId as string;

    // Validate request body
    const validatedData = acceptInvitationSchema.parse(req.body);

    // Accept invitation
    const result = await acceptInvitation(
      userId,
      validatedData.token
    );

    return res.status(200).json({
      success: true,
      message: "Invitation accepted successfully",
      data: {
        workspaceId: result.workspaceId,
        role: result.role,
      },
    });
  } catch (error) {
    next(error);
  }
};