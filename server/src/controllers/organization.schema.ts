import z from "zod";

const createOrganizationSchema = z.object({
  name: z.string().min(6).max(255),
  slug: z.string().max(20),
  socials: z.array(z.string().url()).min(1),
  description: z.string().max(500),
  logoUrl: z.string(),
  members: z.array(z.string()),
});

const updateOrganizationSchema = z.object({
  // data to identify which user is trying to update which organization
  slug: z.string().max(20),

  // data which will get updated of the organization
  name: z.string().min(6).max(255).optional(),
  socials: z.array(z.string().url()).min(1).optional(),
  images: z.array(z.string().url()).min(1).optional(),
  description: z.string().max(500).optional(),
  logoUrl: z.string().optional(),
});

const addMemberSchema = z.object({
  slug: z.string().max(20),
  moodleID: z.string().regex(/^\d{8}$/, "Moodle ID must be exactly 8 digits"),
});

const removeMemberSchema = z.object({
  slug: z.string().max(20),
  moodleID: z.string().regex(/^\d{8}$/, "Moodle ID must be exactly 8 digits"),
});

export { createOrganizationSchema, updateOrganizationSchema, addMemberSchema, removeMemberSchema };
