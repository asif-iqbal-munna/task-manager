import z from "zod";

export const projectValidationSchema = z.object({
  name: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Project name is required"
          : "Project name is required",
    })
    .min(1, { message: "Project name is required" }),
  desc: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Project description is required"
          : "Project description is required",
    })
    .min(1, { message: "Project description is required" }),
  teams: z.array(z.string()).nullable().optional().default([]),
});

export type ProjectValidationSchema = z.infer<typeof projectValidationSchema>;
