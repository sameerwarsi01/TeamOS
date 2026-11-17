
import { createHash } from "node:crypto";
import mongoose from "mongoose";

import RefreshSession from "./refresh-session.model";

// Hash Refresh Token
export const hashRefreshToken = (token: string): string => {
  return createHash("sha256")
    .update(token, "utf8")
    .digest("hex");
};

// Create Refresh Session
export const createRefreshSession = async (
  userId: string,
  refreshToken: string
) => {
  const refreshTokenHash = hashRefreshToken(refreshToken);

  const expiresAt = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  );

  const session = await RefreshSession.create({
    userId: new mongoose.Types.ObjectId(userId),
    refreshTokenHash,
    expiresAt,
  });

  return session;
};

// Find Refresh Session
export const findRefreshSession = async (refreshToken: string) => {
  const refreshTokenHash = hashRefreshToken(refreshToken);

  const session = await RefreshSession.findOne({
    refreshTokenHash,
    revokedAt: null,
    expiresAt: { $gt: new Date() },
  }).select("+refreshTokenHash");

  return session;
};

// Revoke Refresh Session
export const revokeRefreshSession = async (sessionId: string) => {
  const session = await RefreshSession.findByIdAndUpdate(
    sessionId,
    { revokedAt: new Date() },
    { returnDocument: "after" }
  );

  return session;
};
