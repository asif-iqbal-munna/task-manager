import { apiHandler } from "../../../../lib/apiHandler";
import { NextRequest } from "next/server";
import z from "zod";
import { prisma } from "../../../../lib/prisma";
import { extractUser } from "../../../../lib/authMiddleware";
import { throwErrorIf } from "../../../../lib/errorHandler";

const validationSchema = z.object({
  name: z.string().min(1, { message: "Project name is required" }),
  desc: z.string().min(1, { message: "Project description is required" }),
  teams: z.array(z.string()).nullable().optional().default([]),
});

export const POST = apiHandler(async (request: NextRequest) => {
  const payload = await request.json();

  const user = await extractUser(request);

  throwErrorIf(!user, "Unauthorized", 401);

  const validatedPayload = validationSchema.parse(payload);

  const project = await prisma.project.create({
    data: {
      name: validatedPayload.name,
      desc: validatedPayload.desc,
      owner_user_id: user?.id as string,
    },
  });

  if (project && validatedPayload.teams && validatedPayload.teams.length > 0) {
    await prisma.teamProject.createMany({
      data: validatedPayload.teams.map((team) => ({
        team_id: team,
        project_id: project.id,
        owner_user_id: user?.id as string,
      })),
    });
  }

  return project;
});

export const GET = apiHandler(async (request: NextRequest) => {
  const user = await extractUser(request);

  throwErrorIf(!user, "Unauthorized", 401);

  const projects = await prisma.project.findMany({
    where: { owner_user_id: user?.id as string },
    include: {
      teamProjects: {
        include: {
          team: {
            include: {
              teamCollaborations: {
                include: {
                  member: true,
                },
              },
            },
          },
        },
      },
      tasks: true,
    },
  });

  return projects;
});
