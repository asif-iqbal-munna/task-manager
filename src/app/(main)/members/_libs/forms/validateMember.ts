import z from "zod";

export const memberValidationSchema = z.object({
  name: z
    .string({
      error: (issue) => (issue.input ? "Name is required" : "Name is required"),
    })
    .min(1, "Name is required"),
  role: z
    .string({
      error: (issue) => (issue.input ? "Role is required" : "Role is required"),
    })
    .min(1, "Role is required"),
});

export type MemberValidationSchema = z.infer<typeof memberValidationSchema>;
