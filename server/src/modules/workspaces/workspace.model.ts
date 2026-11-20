import mongoose, { Schema, Document } from "mongoose";

export interface IWorkspace extends Document {
    name: string;
    description: string;
    createdBy: mongoose.Types.ObjectId;
}

const workspaceSchema = new Schema<IWorkspace>(
    {
        name: {
            type: String,
            required: [true, "Workspace name is required"],
            trim: true,
            minLength: 2,
            maxLength: 50,
        },

        description: {
            type: String,
             trim: true,
             maxlength: 250,
             default: "",
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

const Workspace = mongoose.model<IWorkspace>(
    "Workspace",
    workspaceSchema
);

export default Workspace;
