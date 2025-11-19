import { NextResponse } from "next/server";
import { extractUser, protectRoute } from "./lib/authMiddleware";

export async function middleware(req: Request) {
  const user = await extractUser();

  const protectionResult = protectRoute(user, req);
  if (protectionResult) return protectionResult;

  const requestHeaders = new Headers(req.headers);
  if (user) {
    requestHeaders.set("x-user", JSON.stringify(user));
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
