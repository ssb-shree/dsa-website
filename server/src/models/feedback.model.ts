import mongoose, { Schema, Types, type ObjectId } from "mongoose";

export type FeedbackType = {
  eventID: ObjectId;
  userID: ObjectId;
  satisfaction: string;
  attendAgain: string;
  instructorFeedback: string;
  nextTopics: string;
  suggestions: string;
  createdAt: Date;
};

const FeedbackSchema = new Schema<FeedbackType>(
  {
    eventID: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },

    userID: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    satisfaction: {
      type: String,
      enum: ["Unsatisfied", "Neutral", "Satisfied", "Very Satisfied"],
      required: true,
    },
    attendAgain: {
      type: String,
      enum: ["Yes", "No"],
      required: true,
    },
    instructorFeedback: {
      type: String,
      enum: ["Unsatisfied", "Neutral", "Satisfied", "Very Satisfied"],
      required: true,
    },
    nextTopics: {
      type: String,
      required: true,
    },
    suggestions: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// One feedback per user per event
FeedbackSchema.index({ eventID: 1, userID: 1 }, { unique: true });

export const FeedBack = mongoose.model("Feedback", FeedbackSchema);
