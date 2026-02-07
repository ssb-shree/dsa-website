import z from "zod";

const achievementSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  imgUrl: z.string().url(),
  date: z.string().min(1),
});

const editAchievementSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  imgUrl: z.string().url().optional(),
  date: z.string().min(1).optional(),
});

export { editAchievementSchema, achievementSchema };
