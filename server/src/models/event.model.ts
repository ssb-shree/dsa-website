import mongoose, { Document, Schema, models } from "mongoose";

export interface EventDocument extends Document {
  title: string;
  description: string;
  date: string;
  registrationLink: string;
  imgUrl: string;
}

const eventSchema = new Schema(
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
    registrationLink: {
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

export const EventModel = models.Event || mongoose.model<EventDocument>("Event", eventSchema);
