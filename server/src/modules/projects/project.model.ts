import mongoose, { Schema, Document } from "mongoose";

export type projectStatus = 
| "planning"
| "active"
| "completed"
| "archived";

export interface IProject extends Document {
    workspaceId: mongoose.Types.ObjectId;
    name: string;
    description?: string;
    status: projectStatus;
    startDate?: Date;
    dueDate?: Date;
    createdBy: mongoose.Types.ObjectId;
}

const projectSchema = new Schema<IProject>(
    {
        workspaceId: {
            type: Schema.Types.ObjectId,
            ref: "Workspace",
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
            maxLength: 100,
        },
        description: {
            type: String,
            trim: true,
            maxLength: 1000,
        },
        status: {
            type: String,
            enum: ["planning", "active", "completed", "archived"],
            dafault: "planning",
            required: true,
        },
        startDate: {
            type: Date,
        },
        dueDate: {
            type: Date,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

projectSchema.index({ workspaceId: 1, createdAt: -1 });

const Project = mongoose.model<IProject>("Project", projectSchema);

export default Project;