import { apiHandler } from "../../../../../lib/apiHandler";
import { NextRequest } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import z from "zod";
import { throwErrorIf } from "../../../../../lib/errorHandler";

const validationSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  role: z.string().min(1, { message: "Role is required" }),
  capacity: z.number().min(0, { message: "Capacity must be greater than 0" }),
});

export const PUT = apiHandler(
  async (
    request: NextRequest,
    { params }: { params: { member_id: string } }
  ) => {
    const payload = await request.json();
    const { member_id } = await params;

    const user = JSON.parse(request.headers.get("x-user") || "{}");

    throwErrorIf(!user, "Unauthorized", 401);

    const validatedPayload = validationSchema.parse(payload);

    const member = await prisma.member.update({
      where: { id: member_id },
      data: validatedPayload,
    });

    return member;
  }
);
