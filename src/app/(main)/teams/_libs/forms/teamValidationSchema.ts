import z from "zod";

export const teamValidationSchema = z.object({
  name: z.string({
    error: (issue) =>
      issue.input === undefined
        ? "Team name is required"
        : "Team name is required",
  }),
});

export type TeamValidationSchema = z.infer<typeof teamValidationSchema>;
