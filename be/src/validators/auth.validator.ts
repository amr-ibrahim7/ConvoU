import { z } from "zod";

export const signupSchema = z.object({
  fullName: z.string({
    error: (issue) =>
      issue.input === undefined
        ? "Full name is required"
        : "Not a string",
  }).min(3, { error: "Full name must be at least 3 characters long" }),

  email: z.string({
    error: (issue) =>
      issue.input === undefined
        ? "Email is required"
        : "Not a string",
  }).email({ error: "Invalid email address" }),

  password: z.string({
    error: (issue) =>
      issue.input === undefined
        ? "Password is required"
        : "Not a string",
  }).min(6, { error: "Password must be at least 6 characters long" }),
});