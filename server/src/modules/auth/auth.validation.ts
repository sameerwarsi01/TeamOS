import { z } from "zod";

// Register validation
export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters"),

  email: z
    .email("Please enter a valid email")
    .trim()
    .toLowerCase(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

// Login validation
export const loginSchema = z.object({
  email: z
    .email("Please enter a valid email")
    .trim()
    .toLowerCase(),

  password: z
    .string()
    .min(1, "Password is required"),
});

// TypeScript types
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;