/* eslint-disable @typescript-eslint/no-explicit-any */
export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const throwErrorIf = (condition: any, message: string, status = 400) => {
  if (condition) throw new ApiError(message, status);
};
