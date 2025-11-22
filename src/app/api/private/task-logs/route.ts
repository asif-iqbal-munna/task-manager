import { apiHandler } from "../../../../lib/apiHandler";
import { NextRequest } from "next/server";
import { extractUser } from "../../../../lib/authMiddleware";
import { throwErrorIf } from "../../../../lib/errorHandler";
import { prisma } from "../../../../lib/prisma";

export const GET = apiHandler(async (request: NextRequest) => {
  const user = await extractUser(request);

  throwErrorIf(!user, "Unauthorized", 401);

  const taskLogs = await prisma.taskLog.findMany({
    where: {
      owner_user_id: user?.id as string,
    },
    include: {
      task: {
        include: {
          project: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  return taskLogs;
});
