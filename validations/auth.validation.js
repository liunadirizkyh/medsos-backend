import * as z from "zod";

export const registerSchema = z.object({
  username: z.string().min(5, "Username must be at least 5 characters long"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  email: z.email("Invalid email address"),
});

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
