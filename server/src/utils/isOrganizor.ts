import type { ObjectId } from "mongoose";
import { User } from "../models/user.model";

export const isUserInOrganization = (user: InstanceType<typeof User>, organizationID: string | ObjectId): boolean => {
  if (!user || !user.organizationID) return false;

  return user.organizationID.some((orgId) => orgId.toString() === organizationID.toString());
};
