import z from "zod";

export const teamValidationSchema = z.object({
  name: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Team name is required"
          : "Team name is required",
    })
    .min(1, { message: "Team name is required" }),
  members: z.array(z.string()).nullable().optional().default([]),
});

export type TeamValidationSchema = z.infer<typeof teamValidationSchema>;
