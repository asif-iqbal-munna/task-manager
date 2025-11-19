import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { apiHandler } from "../../../../lib/apiHandler";
import { z } from "zod";

const registerValidationSchema = z.object({
  name: z.string({
    error: (issue) =>
      issue.input === undefined ? "Name is required" : "Name is required",
  }),
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

  const validatedPayload = registerValidationSchema.parse(payload);

  const { name, email, password } = validatedPayload;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return user;
});
