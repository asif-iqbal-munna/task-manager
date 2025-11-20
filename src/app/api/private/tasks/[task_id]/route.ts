import { apiHandler } from "../../../../../lib/apiHandler";
import { NextRequest } from "next/server";
import { throwErrorIf } from "../../../../../lib/errorHandler";
import { prisma } from "../../../../../lib/prisma";
import z from "zod";

const TaskStatus = z.enum(["PENDING", "IN_PROGRESS", "DONE"]);
const TaskPriority = z.enum(["LOW", "MEDIUM", "HIGH"]);

const validationSchema = z.object({
  title: z.string().min(1, { message: "Task title is required" }),
  desc: z.string().nullable().optional(),
  project_id: z.string().min(1, { message: "Project is required" }),
  assigned_member_id: z.string().nullable().optional(),
  status: TaskStatus.optional(),
  priority: TaskPriority.optional(),
  category_id: z.string().nullable().optional(),
});

export const PUT = apiHandler(
  async (
    request: NextRequest,
    { params }: { params: { task_id: string } }
  ) => {
    const payload = await request.json();
    const { task_id } = params;

    const user = JSON.parse(request.headers.get("x-user") || "{}");

    throwErrorIf(!user, "Unauthorized", 401);

    const validatedPayload = validationSchema.parse(payload);

    const task = await prisma.task.update({
      where: { id: task_id },
      data: {
        title: validatedPayload.title,
        desc: validatedPayload.desc || null,
        project_id: validatedPayload.project_id,
        assigned_member_id: validatedPayload.assigned_member_id || null,
        status: validatedPayload.status,
        priority: validatedPayload.priority,
        category_id: validatedPayload.category_id || null,
      },
    });

    return task;
  }
);

