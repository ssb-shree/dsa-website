export type MemberType = {
  name: string;
  year: string;
  role: string;
  message: string;
  imgUrl: string;
};

import z from "zod";

const memberSchema = z.object({
  name: z.string().min(1).max(30),
  year: z.enum(["FE", "SE", "TE", "BE"]),
  role: z.string().min(1).max(30),
  message: z.string().min(1),
  imgUrl: z.string().min(1).max(30),
});

const editMemberSchema = z.object({
  name: z.string().min(1).max(30).optional(),
  year: z.enum(["FE", "SE", "TE", "BE"]).optional(),
  role: z.string().min(1).max(30).optional(),
  message: z.string().min(1).optional(),
  imgUrl: z.string().min(1).max(30).optional(),
});

export { memberSchema, editMemberSchema };
