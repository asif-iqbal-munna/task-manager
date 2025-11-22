import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { apiHandler } from "../../../../lib/apiHandler";
import { sendResponse } from "../../../../lib/sendResponse";

export const POST = apiHandler(async (request: NextRequest) => {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");

  return sendResponse({
    status: 200,
    success: true,
    message: "Logged out successfully",
  });
});
