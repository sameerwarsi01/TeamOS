import mongoose, { Schema, Document } from "mongoose";

export type TaskStatus = 
| "todo"
| "in-progress"
| "in-review"
| "completed";

export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface ITask extends Document {
    workspaceId: mongoose.Types.ObjectId;
    projectId: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    assignedTo?: mongoose.Types.ObjectId;
    createdBy: mongoose.Types.ObjectId;
    dueDate?: Date;
}

const taskSchema = new Schema<ITask>(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: ["todo", "in-progress", "in-review", "completed"],
      default: "todo",
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dueDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

taskSchema.index({ workspaceId: 1, projectId: 1, createdAt: -1 });
taskSchema.index({ assignedTo: 1, status: 1 });

const Task = mongoose.model<ITask>("Task", taskSchema);

export default Task;