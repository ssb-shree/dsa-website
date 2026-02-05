import mongoose, { Document, models, Schema } from "mongoose";

interface AchivementDocument extends Document {
  title: string;
  description: string;
  date: string;
  imgUrl: string;
}

const achivementSchema = new Schema(
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

export const AchivementModel = models.Achivements ||mongoose.model<AchivementDocument>("Achivement", achivementSchema);
