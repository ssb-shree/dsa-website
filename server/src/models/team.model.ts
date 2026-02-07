import mongoose, { Document, Schema, models } from "mongoose";

export interface MemberDocument extends Document {
  name: string;
  year: string;
  role: string;
  message: string;
  imgUrl: string;
}

const memberSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    imgUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const MemberModel = mongoose.model<MemberDocument>("Member", memberSchema);
