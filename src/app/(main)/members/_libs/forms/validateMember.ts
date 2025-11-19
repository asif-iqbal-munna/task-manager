import z from "zod";

export const memberValidationSchema = z.object({
  name: z.string({
    error: (issue) =>
      issue.input === undefined ? "Name is required" : "Name is required",
  }),
  role: z.string({
    error: (issue) =>
      issue.input === undefined ? "Role is required" : "Role is required",
  }),
});

export type MemberValidationSchema = z.infer<typeof memberValidationSchema>;
