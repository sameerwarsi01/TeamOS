
import mongoose, { Schema, Document } from "mongoose";

export type InvitationRole = "admin" | "member";

export type InvitationStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "revoked"
  | "expired";

export interface IInvitation extends Document {
  workspaceId: mongoose.Types.ObjectId;
  email: string;
  role: InvitationRole;
  invitedBy: mongoose.Types.ObjectId;
  tokenHash: string;
  status: InvitationStatus;
  expiresAt: Date;
}

const invitationSchema = new Schema<IInvitation>(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    role: {
      type: String,
      enum: ["admin", "member"],
      required: true,
    },

    invitedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tokenHash: {
      type: String,
      required: true,
      unique: true,
      select: false,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "revoked", "expired"],
      default: "pending",
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// Index for fetching workspace invitations
invitationSchema.index({ workspaceId: 1, status: 1 });

// Index for checking invitations by email
invitationSchema.index({ email: 1, status: 1 });

// Automatically delete expired invitation records after expiry
invitationSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

const Invitation = mongoose.model<IInvitation>(
  "Invitation",
  invitationSchema
);

export default Invitation;
