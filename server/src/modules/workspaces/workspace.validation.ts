
import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Workspace name must be at least 2 characters")
    .max(50, "Workspace name cannot exceed 50 characters"),

  description: z
    .string()
    .trim()
    .max(250, "Description cannot exceed 250 characters")
    .optional()
    .default(""),
});

export const updateWorkspaceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Workspace name must be at least 2 characters")
    .max(50, "Workspace name cannot exceed 50 characters")
    .optional(),

  description: z
    .string()
    .trim()
    .max(250, "Description cannot exceed 250 characters")
    .optional(),
});

export type CreateWorkspaceInput = z.infer<
  typeof createWorkspaceSchema
>;

export type UpdateWorkspaceInput = z.infer<
  typeof updateWorkspaceSchema
>;