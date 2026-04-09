import * as z from "zod";

export const createFeedSchema = z.object({
  caption: z.string().min(1, "Caption is required"),
});
