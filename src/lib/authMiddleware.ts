/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export const extractUser = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return null;
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
};

export const protectRoute = (user: any, req: Request) => {
  const url = new URL(req.url);
  const pathname = url.pathname;

  if (pathname.startsWith("/api")) {
    if (pathname.startsWith("/api/auth")) {
      return null;
    }

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return null;
  }

  const authRoutes = ["/login", "/register"];

  if (authRoutes.some((path) => pathname.startsWith(path))) {
    if (user) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return null;
  }

  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return null;
};
