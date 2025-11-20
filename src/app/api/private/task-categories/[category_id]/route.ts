import { apiHandler } from "../../../../../lib/apiHandler";
import { NextRequest } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import z from "zod";
import { throwErrorIf } from "../../../../../lib/errorHandler";

const validationSchema = z.object({
  name: z.string().min(1, { message: "Category name is required" }),
});

export const PUT = apiHandler(
  async (
    request: NextRequest,
    { params }: { params: { category_id: string } }
  ) => {
    const payload = await request.json();
    const { category_id } = params;

    const user = JSON.parse(request.headers.get("x-user") || "{}");

    throwErrorIf(!user, "Unauthorized", 401);

    const validatedPayload = validationSchema.parse(payload);

    const taskCategory = await prisma.taskCategory.update({
      where: { id: category_id },
      data: validatedPayload,
    });

    return taskCategory;
  }
);
