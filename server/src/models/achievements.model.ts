import mongoose, { Document, models, Schema } from "mongoose";

interface AchievementDocument extends Document {
  title: string;
  description: string;
  date: string;
  imgUrl: string;
}

const achievementSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
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
  { timestamps: true },
);

export const AchievementModel = mongoose.model<AchievementDocument>("Achievement", achievementSchema);
