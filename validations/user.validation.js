import * as z from "zod";

export const updateProfileSchema = z.object({
  username: z
    .string()
    .min(5, "Username must be at least 5 characters long"),
  fullname: z
    .string()
    .min(2, "Fullname must be at least 2 characters long"),
  bio: z.string().max(200, "Bio must be at most 200 characters long"),
});
