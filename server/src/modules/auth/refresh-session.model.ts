import mongoose, { Schema, Document } from "mongoose";

export interface IRefreshSession extends Document {
    userId: mongoose.Types.ObjectId;
    refreshTokenHash: string;
    expiresAt: Date;
    revokedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

const refreshSessionSchema = new Schema<IRefreshSession>(
    {
     // User associated with this session
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Hashed refresh token
    refreshTokenHash: {
      type: String,
      required: true,
      select: false,
    },

    // Session expiry date
    expiresAt: {
      type: Date,
      required: true,
    },

    // Null means session is active
    revokedAt: {
        type: Date,
        default: null,
    },
},
{
    timestamps: true,
}
);

// Automatically delete expired sessions
refreshSessionSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

// Create RefreshSession Model
const RefreshSession = mongoose.model<IRefreshSession>(
  "RefreshSession",
  refreshSessionSchema
);

export default RefreshSession;