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

const createReassignLogs = async (
  user_id: string,
  task_id: string,
  task_title: string,
  assigned_from_member_id: string,
  assigned_to_member_id: string
) => {
  const fromMember = await prisma.member.findUnique({
    where: { id: assigned_from_member_id },
  });

  const toMember = await prisma.member.findUnique({
    where: { id: assigned_to_member_id },
  });

  const payload = {
    task_id: task_id,
    desc: `Task ${task_title} re-assigned from ${fromMember?.name} to ${toMember?.name}`,
    owner_user_id: user_id,
  };

  await prisma.taskLog.create({
    data: payload,
  });
};

export const PUT = apiHandler(
  async (request: NextRequest, { params }: { params: { task_id: string } }) => {
    const payload = await request.json();
    const { task_id } = params;

    const user = JSON.parse(request.headers.get("x-user") || "{}");

    throwErrorIf(!user, "Unauthorized", 401);

    const validatedPayload = validationSchema.parse(payload);

    const oldAssignedMemberId = await prisma.task.findUnique({
      where: { id: task_id },
      select: { assigned_member_id: true },
    });

    if (
      oldAssignedMemberId &&
      validatedPayload.assigned_member_id &&
      oldAssignedMemberId.assigned_member_id !==
        validatedPayload.assigned_member_id
    ) {
      await createReassignLogs(
        user?.id as string,
        task_id,
        validatedPayload.title,
        oldAssignedMemberId.assigned_member_id as string,
        validatedPayload.assigned_member_id as string
      );
    }

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
