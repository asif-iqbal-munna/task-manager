import { apiHandler } from "../../../../lib/apiHandler";
import { NextRequest } from "next/server";
import z from "zod";
import { prisma } from "../../../../lib/prisma";
import { extractUser } from "../../../../lib/authMiddleware";
import { throwErrorIf } from "../../../../lib/errorHandler";

const validationSchema = z.object({
  name: z.string().min(1, { message: "Team name is required" }),
  members: z.array(z.string()).nullable().optional().default([]),
});

export const POST = apiHandler(async (request: NextRequest) => {
  const payload = await request.json();

  const user = await extractUser(request);

  throwErrorIf(!user, "Unauthorized", 401);

  const validatedPayload = validationSchema.parse(payload);

  const team = await prisma.team.create({
    data: { name: validatedPayload.name, owner_user_id: user?.id as string },
  });

  if (team && validatedPayload.members && validatedPayload.members.length > 0) {
    await prisma.teamCollaboration.createMany({
      data: validatedPayload.members.map((member) => ({
        team_id: team.id,
        member_id: member,
        owner_user_id: user?.id as string,
      })),
    });
  }

  return team;
});

export const GET = apiHandler(async (request: NextRequest) => {
  const user = await extractUser(request);
  console.log({ extractUser: user });

  throwErrorIf(!user, "Unauthorized", 401);

  const teams = await prisma.team.findMany({
    where: { owner_user_id: user?.id as string },
    include: {
      teamCollaborations: {
        include: {
          member: true,
        },
      },
    },
  });

  return teams;
});
