
import { z } from "zod";

const projectStatusSchema = z.enum([
  "planning",
  "active",
  "completed",
  "archived",
]);

export const createProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Project name must be at least 3 characters")
    .max(100, "Project name cannot exceed 100 characters"),

  description: z
    .string()
    .trim()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional(),

  status: projectStatusSchema.optional(),

  startDate: z.coerce.date().optional(),

  dueDate: z.coerce.date().optional(),
}).refine(
  (data) =>
    !data.startDate ||
    !data.dueDate ||
    data.dueDate >= data.startDate,
  {
    message: "Due date must be on or after start date",
    path: ["dueDate"],
  }
);

export const updateProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Project name must be at least 3 characters")
    .max(100, "Project name cannot exceed 100 characters")
    .optional(),

  description: z
    .string()
    .trim()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional(),

  status: projectStatusSchema.optional(),

  startDate: z.coerce.date().optional(),

  dueDate: z.coerce.date().optional(),
}).refine(
  (data) =>
    !data.startDate ||
    !data.dueDate ||
    data.dueDate >= data.startDate,
  {
    message: "Due date must be on or after start date",
    path: ["dueDate"],
  }
);

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;