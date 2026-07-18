import { z } from "zod";
import { Types } from "mongoose";

export const feedbackSchema = z.object({
  eventID: z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid eventID",
  }),

  satisfaction: z.enum(["Unsatisfied", "Neutral", "Satisfied", "Very Satisfied"]),

  attendAgain: z.enum(["Yes", "No"]),

  instructorFeedback: z.enum(["Unsatisfied", "Neutral", "Satisfied", "Very Satisfied"]),

  nextTopics: z.string().min(1, "Next topics is required"),

  suggestions: z.string().min(1, "Suggestions is required"),
});
