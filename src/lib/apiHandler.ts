/* eslint-disable @typescript-eslint/no-explicit-any */
import { ZodError } from "zod";
import { ApiError } from "./errorHandler";
import { sendResponse } from "./sendResponse";

export function apiHandler(handler: Promise<any> | any) {
  return async (req: Request, ...args: any[]) => {
    try {
      const result = await handler(req, ...args);

      return sendResponse({
        data: result,
        status: 200,
        success: true,
        message: "Data processed successfully",
      });
    } catch (error: any) {
      if (error.name === "PrismaClientKnownRequestError") {
        console.error(error.name, "error name");
        console.error(error.message, "error message");
        console.error(error.code, "error code");
        console.error(error.meta, "error meta");
        console.error(error.meta, "error meta");
        return sendResponse({
          status: 400,
          success: false,
          error: error.message,
          message: `${error.meta?.target[0]} already exists`,
        });
      }

      if (error instanceof ZodError) {
        return sendResponse({
          status: 400,
          success: false,
          error: error.issues[0]?.message,
          message: error.issues[0]?.message,
        });
      }
      return sendResponse({
        status: (error as ApiError).statusCode || 500,
        success: false,
        error: (error as Error).message || "Internal server error",
        message: (error as Error).message || "Internal server error",
        stack: (error as Error).stack || undefined,
      });
    }
  };
}
