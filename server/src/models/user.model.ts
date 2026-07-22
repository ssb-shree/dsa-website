import mongoose, { Schema, type ObjectId } from "mongoose";
import { comparePassword, hashPassword } from "../utils/bcrypt";

export interface UserDocument extends mongoose.Document {
  _id: ObjectId;
  moodleID: string;
  password: string;

  name: string;
  year: string;
  division: string;
  department: string;
  role: string;
  organizationID: ObjectId[];
  registeredEvents: ObjectId[];
  comparePassword(value: string): Promise<boolean>;
}

const userSchema = new Schema<UserDocument>(
  {
    moodleID: {
      type: String,
      required: true,
      unique: true,
      maxLength: 8,
    },
    name: {
      type: String,
      required: true,
    },

    year: {
      type: String,
      required: true,
      enum: ["FE", "SE", "TE", "BE"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    division: {
      type: String,
      required: true,
      maxlength: 1,
    },
    department: {
      type: String,
      required: true,
      enum: ["DS", "AIML", "IT", "COMP", "CIVIL", "MECH"],
    },
    role: {
      type: String,
      required: true,
      enum: ["USER", "ORGANIZOR", "ADMIN"],
      default: "USER",
    },
    organizationID: [
      {
        type: Schema.Types.ObjectId,
        ref: "Organization",
      },
    ],
    registeredEvents: [
      {
        type: Schema.Types.ObjectId,
        ref: "Event",
        default: [],
      },
    ],
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hashPassword(this.password);
  } else {
    next();
  }
});

// WILL FIX THIS LATER

// userSchema.pre("findOneAndUpdate", async function (next) {
//   const update = this.getUpdate();

//   if (update.password) {
//     update.password = await hashPassword(update.password);
//   }

//   next();
// });

userSchema.methods.comparePassword = async function (pass: string) {
  return await comparePassword(pass, this.password);
};

export const User = mongoose.model<UserDocument>("User", userSchema);
