import z from "zod";

export const createHighlightSchema = z.object({
  title: z.string().min(1).max(255),
  img1Url: z.string().url(),
  img2Url: z.string().url(),
  img3Url: z.string().url(),
});

export const updateHighlightSchema = createHighlightSchema.partial();