import mongoose, { Schema, type ObjectId } from "mongoose";

export interface AchievementDocument extends mongoose.Document {
  _id: ObjectId;
  title: string;
  description: string;
  date: string;
  imgUrl: string;
}

const achievementSchema = new Schema<AchievementDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
    },
    imgUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Achievement = mongoose.model<AchievementDocument>(
  "Achievement",
  achievementSchema,
);