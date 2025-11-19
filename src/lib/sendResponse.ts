import { NextResponse } from "next/server";

type ResponseData = {
  data?: unknown;
  status: number;
  success: boolean;
  message?: string;
  error?: string;
  stack?: string;
};

export const sendResponse = (responseData: ResponseData) => {
  const responseObj: ResponseData = {
    data: responseData.data,
    status: responseData.status,
    success: responseData.success,
    message: responseData.message,
  };

  if (process.env.NODE_ENV === "development") {
    responseObj.error = responseData.error;
    responseObj.stack = responseData.stack;
  }

  return NextResponse.json(responseObj, { status: responseData.status });
};
