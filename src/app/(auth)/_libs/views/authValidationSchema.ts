import { z } from "zod";

export const loginValidationSchema = z.object({
  email: z.email({
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

export const registerValidationSchema = z
  .object({
    fullName: z.string({
      error: (issue) =>
        issue.input === undefined
          ? "Full name is required"
          : "Full name is required",
    }),
    email: z.email({
      error: (issue) =>
        issue.input === undefined
          ? "Email is required"
          : "Invalid email address",
    }),
    password: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "Password is required"
            : "Password is required",
      })
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "Confirm password is required"
            : "Confirm password is required",
      })
      .min(8, { message: "Confirm password must be at least 8 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
