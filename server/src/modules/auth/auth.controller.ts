
import type { Request, Response } from "express";

import {
  registerSchema,
  loginSchema,
} from "./auth.validation";

import {
  registerUser,
  loginUser,
} from "./auth.service";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/token";

import {
  createRefreshSession,
  findRefreshSession,
  revokeRefreshSession,
} from "./refresh-session.service";

// Register Controller
export const registerController = async (
  req: Request,
  res: Response
) => {
  try {
    // 1. Validate request body
    const validateData = registerSchema.parse(req.body);

    // 2. Register user
    const user = await registerUser(validateData);

    // 3. Send response
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });

  } catch (error) {
    
    if (error instanceof Error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Login Controller
export const loginController = async (
  req: Request,
  res: Response
) => {
  try {
    // 1. Validate request body
    const validateData = loginSchema.parse(req.body);

    // 2. Authenticate user
    const user = await loginUser(validateData);

    // 3. Generate tokens
    const userId = user._id.toString();

    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);

    // 4. Save refresh token hash in database
    await createRefreshSession(userId, refreshToken);

    // 5. Set refresh token in HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    // 6. Send response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user,
        accessToken,
      },
    });

  } catch (error) {

    if (error instanceof Error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Refresh Token Controller
export const refreshTokenController = async (
  req: Request,
  res: Response
) => {
  try {
    // 1. Get refresh token from cookie
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    // 2. Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // 3. Find active session in database
    const session = await findRefreshSession(refreshToken);

    if (
      !session ||
      session.userId.toString() !== decoded.userId
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh session",
      });
    }

    // 4. Generate new tokens
    const newAccessToken = generateAccessToken(decoded.userId);
    const newRefreshToken = generateRefreshToken(decoded.userId);

    // 5. Create new refresh session
    await createRefreshSession(decoded.userId, newRefreshToken);

    // 6. Revoke old refresh session
    await revokeRefreshSession(session._id.toString());

    // 7. Set new refresh token cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    // 8. Send new access token
    return res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
      data: {
        accessToken: newAccessToken,
      },
    });

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }
};



// LOGOUT CONTROLLER
export const logoutController = async (
  req: Request,
  res: Response
) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    // Revoke refresh session
    if (refreshToken) {
      const session = await findRefreshSession(refreshToken);

      if (session) {
        await revokeRefreshSession(session._id.toString());
      }
    }

    // Clear refresh token cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });

  } catch (error) {
    console.error("LOGOUT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};