import mongoose, { Schema, type ObjectId } from "mongoose";

export interface EventsDocument extends mongoose.Document {
  title: string;
  date: string; // change to Date

  time: string;
  banner: string;
  venue: string;
  speakers: string[];
  description: string;
  tags: string[];
  externalLinks: { name: string; link: string }[];
  slug: string;

  // filters
  allowedYears: string[];
  allowedDepartments: string[];
  allowedDivisions: string[];

  // org info
  organizationID: ObjectId;

  // data handling of students
  registerdStudentsID: string[];
  attendedStudentsID: Map<string, Date>;
  studentFeedbacks: ObjectId[];

  //bools to hide/show certain action for the user
  canRegister: boolean;
  canFeedback: boolean;
  isPublic: boolean;
}

const eventsSchema = new Schema<EventsDocument>(
  {
    // org info
    organizationID: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    // data about the event
    title: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String, // change to Date
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    venue: {
      type: String,
      required: true,
      trim: true,
    },
    banner: {
      type: String,
      required: true,
    },
    speakers: {
      type: [String],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    externalLinks: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        link: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
    slug: {
      type: String,
      required: true,
      unique: true,
    },

    // filters
    allowedYears: {
      type: [String],
      default: [],
    },
    allowedDepartments: {
      type: [String],
      default: [],
    },
    allowedDivisions: {
      type: [String],
      default: [],
    },

    // data handling of students
    registerdStudentsID: {
      type: [String],
      default: [],
    },
    attendedStudentsID: {
      type: Map,
      of: Date,
    },

    //bools to hide/show certain action for the user
    canRegister: {
      type: Boolean,
      default: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    canFeedback: {
      type: Boolean,
      default: false,
    },
    studentFeedbacks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Feedback",
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const Event = mongoose.model<EventsDocument>("Event", eventsSchema);
