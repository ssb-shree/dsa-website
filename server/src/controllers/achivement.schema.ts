import z from "zod";

const achivementSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  imgUrl: z.string().url(),
});

const editAchivementSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  imgUrl: z.string().url().optional(),
});

export { editAchivementSchema, achivementSchema };
