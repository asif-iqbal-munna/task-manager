import { apiHandler } from "../../../../../lib/apiHandler";
import { NextRequest } from "next/server";
import { throwErrorIf } from "../../../../../lib/errorHandler";
import { prisma } from "../../../../../lib/prisma";
import z from "zod";

const validationSchema = z.object({
  name: z.string().min(1, { message: "Project name is required" }),
  desc: z.string().min(1, { message: "Project description is required" }),
  teams: z.array(z.string()).nullable().optional().default([]),
});

export const PUT = apiHandler(
  async (
    request: NextRequest,
    { params }: { params: { project_id: string } }
  ) => {
    const payload = await request.json();
    const { project_id } = params;

    const user = JSON.parse(request.headers.get("x-user") || "{}");

    throwErrorIf(!user, "Unauthorized", 401);

    const project = await prisma.project.findUnique({
      where: { id: project_id, owner_user_id: user?.id as string },
    });

    throwErrorIf(!project, "Project not found", 404);

    const validatedPayload = validationSchema.parse(payload);

    const existingTeams = await prisma.teamProject.findMany({
      where: { project_id: project_id },
    });

    const newTeams = validatedPayload.teams?.filter(
      (team) => !existingTeams.some((t) => t.team_id === team)
    );

    const removedTeams = existingTeams.filter(
      (team) => !validatedPayload.teams?.includes(team.team_id)
    );

    if (removedTeams && removedTeams.length > 0) {
      await prisma.teamProject.deleteMany({
        where: {
          project_id: project_id,
          team_id: { in: removedTeams.map((t) => t.team_id) },
        },
      });
    }

    if (newTeams && newTeams.length > 0) {
      await prisma.teamProject.createMany({
        data: newTeams.map((team) => ({
          team_id: team,
          project_id: project_id,
          owner_user_id: user?.id as string,
        })),
      });
    }

    const updatedProject = await prisma.project.update({
      where: { id: project_id },
      data: {
        name: validatedPayload.name,
        desc: validatedPayload.desc,
      },
    });

    return updatedProject;
  }
);
