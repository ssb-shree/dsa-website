import z from "zod";

const eventSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  registrationLink: z.string().url(),
  imgUrl: z.string().url(),
  date: z.string(),
});

const editEventSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  registrationLink: z.string().url().optional(),
  imgUrl: z.string().url().optional(),
  date: z.string().optional(),
});

export { editEventSchema, eventSchema };
