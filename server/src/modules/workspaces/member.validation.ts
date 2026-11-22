import { z } from "zod";

// Update Workspace Role
export const updateMemberRoleSchema = z.object({
    role: z.enum(
        ["admin", "member"],
        {
            message: "Role must be either admin or member",
        }
    ),
});

export type updateMemberRoleInput = z.infer<
   typeof updateMemberRoleSchema
>