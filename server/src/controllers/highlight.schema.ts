import { z } from "zod";

export const createAchievementSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1),
  date: z.string().min(1),
  imgUrl: z.string().url(),
});

export const updateAchievementSchema = createAchievementSchema.partial();

