import { apiHandler } from "../../../../lib/apiHandler";
import { NextRequest } from "next/server";
import z from "zod";
import { prisma } from "../../../../lib/prisma";
import { extractUser } from "../../../../lib/authMiddleware";
import { throwErrorIf } from "../../../../lib/errorHandler";

const TaskStatus = z.enum(["PENDING", "IN_PROGRESS", "DONE"]);
const TaskPriority = z.enum(["LOW", "MEDIUM", "HIGH"]);

const validationSchema = z.object({
  title: z.string().min(1, { message: "Task title is required" }),
  desc: z.string().nullable().optional(),
  project_id: z.string().min(1, { message: "Project is required" }),
  assigned_member_id: z.string().nullable().optional(),
  status: TaskStatus.optional().default("PENDING"),
  priority: TaskPriority.optional().default("MEDIUM"),
  category_id: z.string().nullable().optional(),
});

export const POST = apiHandler(async (request: NextRequest) => {
  const payload = await request.json();

  const user = await extractUser(request);

  throwErrorIf(!user, "Unauthorized", 401);

  const validatedPayload = validationSchema.parse(payload);

  const task = await prisma.task.create({
    data: {
      title: validatedPayload.title,
      desc: validatedPayload.desc || null,
      project_id: validatedPayload.project_id,
      assigned_member_id: validatedPayload.assigned_member_id || null,
      status: validatedPayload.status || "PENDING",
      priority: validatedPayload.priority || "MEDIUM",
      category_id: validatedPayload.category_id || null,
      owner_user_id: user?.id as string,
    },
  });

  return task;
});

export const GET = apiHandler(async (request: NextRequest) => {
  const user = await extractUser(request);

  throwErrorIf(!user, "Unauthorized", 401);

  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("project_id");
  const startDate = searchParams.get("start_date");
  const endDate = searchParams.get("end_date");

  const where: {
    owner_user_id: string;
    project_id?: string;
    createdAt?: {
      gte?: Date;
      lte?: Date;
    };
  } = {
    owner_user_id: user?.id as string,
  };

  if (projectId) {
    where.project_id = projectId;
  }

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      where.createdAt.gte = start;
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      where.createdAt.lte = end;
    }
  }

  const tasks = await prisma.task.findMany({
    where,
    include: {
      project: true,
      assigned_member: true,
      category: true,
    },
  });

  return tasks;
});
