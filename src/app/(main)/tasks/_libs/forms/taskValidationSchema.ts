import z from "zod";

const TaskStatus = z.enum(["PENDING", "IN_PROGRESS", "DONE"]);
const TaskPriority = z.enum(["LOW", "MEDIUM", "HIGH"]);

export const taskValidationSchema = z.object({
  title: z
    .string({
      error: (issue) =>
        issue.input ? "Task title is required" : "Task title is required",
    })
    .min(1, "Task title is required"),
  desc: z.string().nullable().optional(),
  project_id: z
    .string({
      error: (issue) =>
        issue.input ? "Project is required" : "Project is required",
    })
    .min(1, "Project is required"),
  assigned_member_id: z.string().nullable().optional(),
  status: TaskStatus,
  priority: TaskPriority,
  category_id: z.string().nullable().optional(),
});

export type TaskValidationSchema = z.infer<typeof taskValidationSchema>;
