import { apiHandler } from "../../../../../lib/apiHandler";
import { NextRequest } from "next/server";
import { throwErrorIf } from "../../../../../lib/errorHandler";
import { prisma } from "../../../../../lib/prisma";
import z from "zod";

const validationSchema = z.object({
  name: z.string().min(1, { message: "Team name is required" }),
  members: z.array(z.string()).nullable().optional().default([]),
});

export const PUT = apiHandler(
  async (request: NextRequest, { params }: { params: { team_id: string } }) => {
    const payload = await request.json();
    const { team_id } = params;

    const user = JSON.parse(request.headers.get("x-user") || "{}");

    throwErrorIf(!user, "Unauthorized", 401);

    const team = await prisma.team.findUnique({
      where: { id: team_id, owner_user_id: user?.id as string },
    });

    throwErrorIf(!team, "Team not found", 404);

    const validatedPayload = validationSchema.parse(payload);

    const existingMembers = await prisma.teamCollaboration.findMany({
      where: { team_id: team_id },
    });

    const newMembers = validatedPayload.members?.filter(
      (member) => !existingMembers.some((m) => m.member_id === member)
    );

    const removedMembers = existingMembers.filter(
      (member) => !validatedPayload.members?.includes(member.member_id)
    );

    if (removedMembers && removedMembers.length > 0) {
      await prisma.teamCollaboration.deleteMany({
        where: {
          team_id: team_id,
          member_id: { in: removedMembers.map((m) => m.member_id) },
        },
      });
    }

    if (newMembers && newMembers.length > 0) {
      await prisma.teamCollaboration.createMany({
        data: newMembers.map((member) => ({
          team_id: team_id,
          member_id: member,
          owner_user_id: user?.id as string,
        })),
      });
    }

    const updatedTeam = await prisma.team.update({
      where: { id: team_id },
      data: {
        name: validatedPayload.name,
      },
    });

    return updatedTeam;
  }
);
