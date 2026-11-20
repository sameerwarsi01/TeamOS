import mongoose, { Schema, Document } from "mongoose";

export type WorkspaceRole = "owner" | "admin" | "member";

export interface IWorkspaceMember extends Document {
    workspaceId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    role: WorkspaceRole;
    joinedAt: Date;
}

const workspaceMemberSchema = new Schema<IWorkspaceMember>(
    {
        workspaceId: {
            type: Schema.Types.ObjectId,
            ref: "Workspace",
            required: true,
        },

        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        role: {
            type: String,
            enum: ["owner", "admin", "member"],
            default: "member",
            required: true,
        },

        joinedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// A user can join a workspace only once.
workspaceMemberSchema.index(
    { workspaceId: 1, userId: 1 },
    { unique: true }
);

const WorkspaceMember = mongoose.model<IWorkspaceMember>(
    "WorkspaceMember",
    workspaceMemberSchema
);

export default WorkspaceMember;