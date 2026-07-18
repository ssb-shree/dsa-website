import z from "zod";

const hostEventSchema = z.object({
  // event info
  title: z.string().min(2),
  banner: z.string().min(1),
  date: z.string().min(2),

  time: z.string().min(1),
  venue: z.string().min(1),
  speakers: z.array(z.string().min(1)).min(1),
  description: z.string().min(1),
  tags: z.array(z.string().min(1)).min(1).max(5),
  externalLinks: z.array(z.object({ name: z.string().min(1), link: z.string().url() })).max(5),

  // org info
  organizationID: z.string().min(1).max(25),

  //filters
  allowedYears: z.array(z.string().min(1)).optional(),
  allowedDepartments: z.array(z.string().min(1)).optional(),
  allowedDivisions: z.array(z.string().min(1)).optional(),
});

const updateEventSchema = z.object({
  // event info that may change
  title: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  banner: z.string().min(1).optional(),
  date: z.string().min(2).optional(),

  time: z.string().min(1).optional(),
  venue: z.string().min(1).optional(),
  speakers: z.array(z.string().min(1)).min(1).optional(),
  description: z.string().min(1).optional(),
  tags: z.array(z.string().min(1)).min(1).max(5).optional(),
  externalLinks: z
    .array(z.object({ name: z.string().min(1), link: z.string().url() }))
    .max(5)
    .optional(),

  // org info
  organizationID: z.string().min(1).max(25),

  //bools to hide/show certain action for the user
  canRegister: z.boolean().optional(),
  canFeedback: z.boolean().optional(),
  isPublic: z.boolean().optional(),

  //filters
  allowedYears: z.array(z.string().min(1)).optional(),
  allowedDepartments: z.array(z.string().min(1)).optional(),
  allowedDivisions: z.array(z.string().min(1)).optional(),
});

const registerStudentSchema = z.object({
  moodleID: z.string().regex(/^\d{8}$/, "Moodle ID must be exactly 8 digits"),
  eventID: z.string(),
});

const addAttendedStudentSchema = z.object({
  moodleID: z.string().regex(/^\d{8}$/, "Moodle ID must be exactly 8 digits"),
  eventID: z.string(),
});

const getListSchema = z.object({
  eventID: z.string(),
});

export { hostEventSchema, updateEventSchema, registerStudentSchema, addAttendedStudentSchema, getListSchema };
