import { NextRequest } from "next/server";
import { apiHandler } from "../../../../lib/apiHandler";
import { throwErrorIf } from "../../../../lib/errorHandler";
import { prisma } from "../../../../lib/prisma";
import z from "zod";
import { extractUser } from "../../../../lib/authMiddleware";

const validationSchema = z.object({
  name: z.string().min(1, { message: "Category name is required" }),
});

export const POST = apiHandler(async (request: NextRequest) => {
  const payload = await request.json();
  const validatedPayload = validationSchema.parse(payload);

  const user = await extractUser(request);

  throwErrorIf(!user, "Unauthorized", 401);

  const taskCategory = await prisma.taskCategory.create({
    data: {
      name: validatedPayload.name,
      owner_user_id: user?.id as string,
    },
  });

  return taskCategory;
});

export const GET = apiHandler(async (request: NextRequest) => {
  const user = await extractUser(request);
  throwErrorIf(!user, "Unauthorized", 401);

  const taskCategories = await prisma.taskCategory.findMany({
    where: { owner_user_id: user?.id as string },
    include: {
      tasks: {
        select: {
          id: true,
        },
      },
    },
  });

  return taskCategories;
});
