import mongoose, { Schema, type ObjectId } from "mongoose";

export interface HighlightDocument extends mongoose.Document {
  _id: ObjectId;
  title: string;
  img1Url: string;
  img2Url: string;
  img3Url: string;
}

const highlightSchema = new Schema<HighlightDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    img1Url: {
      type: String,
      required: true,
    },
    img2Url: {
      type: String,
      required: true,
    },
    img3Url: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Highlight = mongoose.model<HighlightDocument>(
  "Highlight",
  highlightSchema,
);