
import type { Request, Response } from "express";
import User from "./user.model";

// Get Logged-in User Profile
export const getCurrentUser = async (
  req: Request,
  res: Response
) => {
  try {
    // Get userId from authentication middleware
    const userId = res.locals.userId;

    // Find user in MongoDB
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Send user profile
    return res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      data: user,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};