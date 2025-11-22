import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { apiHandler } from "../../../../lib/apiHandler";
import { z } from "zod";
import { throwErrorIf } from "../../../../lib/errorHandler";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const loginValidationSchema = z.object({
  email: z.string({
    error: (issue) =>
      issue.input === undefined ? "Email is required" : "Invalid email address",
  }),
  password: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Password is required"
          : "Password is required",
    })
    .min(8, { message: "Password must be at least 8 characters" }),
});

export const POST = apiHandler(async (request: NextRequest) => {
  const payload = await request.json();

  const validatedPayload = loginValidationSchema.parse(payload);

  const { email, password } = validatedPayload;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  throwErrorIf(!user, "User not found", 404);

  const isPasswordValid = await bcrypt.compare(
    password,
    user?.password as string
  );

  throwErrorIf(!isPasswordValid, "Invalid password", 401);

  const userPayload = {
    id: user?.id,
    name: user?.name,
    email: user?.email,
  };

  const accessTokenSecret = process.env.JWT_ACCESS_SECRET;
  const accessTokenExpiry = process.env.JWT_ACCESS_EXPIRATION_TIME || "1d";

  if (!accessTokenSecret) {
    throw new Error("JWT secrets are not configured");
  }

  const accessToken = jwt.sign(userPayload, accessTokenSecret, {
    expiresIn: accessTokenExpiry,
  } as jwt.SignOptions);

  const cookieStore = await cookies();

  const isProduction = process.env.NODE_ENV === "production";

  cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 1, // 1 day
  });

  return {
    accessToken,
  };
});
