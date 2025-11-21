import { apiHandler } from "../../../../../lib/apiHandler";
import { NextRequest } from "next/server";
import { throwErrorIf } from "../../../../../lib/errorHandler";
import { User } from "../../../../../generated/prisma/client";
import { prisma } from "../../../../../lib/prisma";

export const GET = apiHandler(async (request: NextRequest) => {
  const user = JSON.parse(request.headers.get("x-user") || "{}") as User;

  throwErrorIf(!user, "Unauthorized", 401);

  const userData = await prisma.user.findUnique({
    where: { id: user?.id },
  });

  return userData;
});
