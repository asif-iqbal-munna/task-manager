import { NextRequest } from "next/server";
import { apiHandler } from "../../../../lib/apiHandler";
import { throwErrorIf } from "../../../../lib/errorHandler";
import { prisma } from "../../../../lib/prisma";
import z from "zod";

const validationSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  role: z.string().min(1, { message: "Role is required" }),
  capacity: z.number().min(0, { message: "Capacity must be greater than 0" }),
});

export const POST = apiHandler(async (request: NextRequest) => {
  const payload = await request.json();
  const validatedPayload = validationSchema.parse(payload);

  const user = JSON.parse(request.headers.get("x-user") || "{}");

  throwErrorIf(!user, "Unauthorized", 401);

  const member = await prisma.member.create({
    data: {
      name: validatedPayload.name,
      role: validatedPayload.role,
      capacity: validatedPayload.capacity,
      owner_user_id: user?.id as string,
    },
  });

  return member;
});

export const GET = apiHandler(async (request: NextRequest) => {
  const user = JSON.parse(request.headers.get("x-user") || "{}");
  throwErrorIf(!user, "Unauthorized", 401);

  const members = await prisma.member.findMany({
    where: { owner_user_id: user?.id as string },
    select: {
      id: true,
      name: true,
      capacity: true,
      role: true,
      tasks: {
        select: {
          id: true,
        },
      },
      teamCollaborations: {
        select: {
          team_id: true,
          team: {
            select: {
              id: true,
              teamProjects: {
                select: {
                  project_id: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return members;
});
