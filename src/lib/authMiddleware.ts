/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export const extractUser = async (req: NextRequest) => {
  const cookieStore = req.cookies;
  const token = cookieStore.get("accessToken")?.value || null;

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

export const protectRoute = (user: any, req: NextRequest) => {
  const url = new URL(req.url);
  const pathname = url.pathname;

  if (pathname.startsWith("/api")) {
    if (pathname.startsWith("/api/auth")) {
      return null;
    }

    if (!user) {
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");

      return response;
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
