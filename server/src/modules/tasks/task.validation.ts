import { z } from "zod";

const taskStatusSchema = z.enum([
  "todo",
  "in-progress",
  "in-review",
  "completed",
]);

const taskPrioritySchema = z.enum([
  "low",
  "medium",
  "high",
  "urgent",
]);

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Task title must be at least 3 characters")
    .max(200, "Task title cannot exceed 200 characters"),

  description: z
    .string()
    .trim()
    .max(2000, "Description cannot exceed 2000 characters")
    .optional(),

  status: taskStatusSchema.optional(),

  priority: taskPrioritySchema.optional(),

  assignedTo: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid assigned user ID")
    .optional(),

  dueDate: z.coerce.date().optional(),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Task title must be at least 3 characters")
    .max(200, "Task title cannot exceed 200 characters")
    .optional(),

  description: z
    .string()
    .trim()
    .max(2000, "Description cannot exceed 2000 characters")
    .optional(),

  status: taskStatusSchema.optional(),

  priority: taskPrioritySchema.optional(),

  assignedTo: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid assigned user ID")
    .optional(),

  dueDate: z.coerce.date().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;