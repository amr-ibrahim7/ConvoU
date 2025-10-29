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


export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  
  password: z
    .string()
    .min(1, { message: "Password is required" }),
});

export type LoginBody = z.infer<typeof loginSchema>;


export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required" }),
  newPassword: z.string().min(6, { message: "New password must be at least 6 characters long" }),
});