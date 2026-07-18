import mongoose, { Schema, type ObjectId } from "mongoose";

export interface OrganizationDocument extends mongoose.Document {
  name: string;
  slug: string;
  description: string;
  socials: string[];
  images: string[];
  logoUrl: string;
  members: ObjectId[];
  events: ObjectId[];
}

const organizationSchema = new Schema<OrganizationDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    logoUrl: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    socials: {
      type: [String],
      required: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        deafault: [],
      },
    ],
    events: [
      {
        type: Schema.Types.ObjectId,
        ref: "Event",
        deafault: [],
      },
    ],
  },
  { timestamps: true },
);

export const Organization = mongoose.model<OrganizationDocument>("Organization", organizationSchema);
