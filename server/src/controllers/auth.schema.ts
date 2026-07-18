import z from "zod";

const registerSchema = z.object({
  moodleID: z.string().regex(/^\d{8}$/, "Moodle ID must be exactly 8 digits"),
  name: z.string().min(6).max(255),
  email: z.string().email(),
  password: z.string().min(6).max(255),
  year: z.enum(["FE", "SE", "TE", "BE"]),
  division: z.string().length(1),
  department: z.enum(["DS", "AIML", "IT", "COMP", "CIVIL", "MECH"]),
});

const loginSchema = z.object({
  moodleID: z.string().regex(/^\d{8}$/, "Moodle ID must be exactly 8 digits"),
  password: z.string().min(6).max(255),
});

const findSchema = z.object({
  moodleID: z.string().regex(/^\d{8}$/, "Moodle ID must be exactly 8 digits"),
});

const updateSchema = z.object({
  moodleID: z
    .string()
    .regex(/^\d{8}$/, "Moodle ID must be exactly 8 digits")
    .optional(),
  name: z.string().min(6).max(255).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).max(255).optional(),
  year: z.enum(["FE", "SE", "TE", "BE"]).optional(),
  division: z.string().length(1).optional(),
  department: z.enum(["DS", "AIML", "IT", "COMP", "CIVIL", "MECH"]).optional(),
});

export { registerSchema, loginSchema, findSchema, updateSchema };
