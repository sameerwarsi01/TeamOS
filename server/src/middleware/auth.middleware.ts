import type { Request, Response, NextFunction } from "express";

import { verifyAccessToken } from "../utils/token";

// Authentication Middleware
export const authenticateUser = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // 1. Get token from Authorization header
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Access token is required",
            });
        }

        // 2. Extract token
          const token = authHeader.split(" ")[1]?.trim().replace(/^"|"$/g, "");

            if (!token) {
              return res.status(401).json({
              success: false,
              message: "Access token is required",
    });
}

        // 3. Verify token
        const decoded = verifyAccessToken(token);

        // 4. Attach userId to request
        res.locals.userId = decoded.userId;

        // 5. Move to next middleware or route
        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid or expired access token",
        });
    }
};