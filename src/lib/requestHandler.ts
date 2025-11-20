import axios, { AxiosError } from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

const axiosInstance = axios.create({
  baseURL,
});

export const requestHandler = async (
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  body?: Record<string, unknown>
) => {
  try {
    const response = await axiosInstance.request({
      url,
      method,
      data: method !== "GET" ? body ?? undefined : undefined,
      params: method === "GET" ? body : undefined,
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const errorResponse = error.response?.data;

      // Extract error message from API response
      const errorMessage =
        errorResponse?.message || errorResponse?.error || error.message;

      // Throw error so React Query's onError handler can catch it
      throw new Error(errorMessage);
    }

    // Handle non-Axios errors
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("An unexpected error occurred. Please try again.");
  }
};
