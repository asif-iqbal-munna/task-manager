import z from "zod";

export const taskCategoryValidationSchema = z.object({
  name: z
    .string({
      error: (issue) =>
        issue.input ? "Category name is required" : "Category name is required",
    })
    .min(1, "Category name is required"),
});

export type TaskCategoryValidationSchema = z.infer<
  typeof taskCategoryValidationSchema
>;
