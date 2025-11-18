import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const body = await request.json();
  console.log({ body });
  const user = await prisma.user.create({
    data: body,
  });
  console.log({ user });
  return NextResponse.json(user);
}

export async function GET(request: NextRequest) {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}
