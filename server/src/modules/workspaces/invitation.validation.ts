
import { z } from "zod";

export const createInvitationSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address")
    .toLowerCase(),

  role: z.enum(["admin", "member"]),
});

export const acceptInvitationSchema = z.object({
  token: z
    .string()
    .trim()
    .min(1, "Invitation token is required"),
});

export type CreateInvitationInput = z.infer<
  typeof createInvitationSchema
>;

export type AcceptInvitationInput = z.infer<
  typeof acceptInvitationSchema
>;