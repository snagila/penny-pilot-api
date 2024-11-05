import mongoose, { Document, Schema } from "mongoose";

export interface user extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: number;
  password: string;
  verified: boolean;
  refreshJWT: string;
}

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema: Schema = new Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 15,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 15,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [emailRegex, "Please enter a valid email address."],
  },
  phone: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  refreshJWT: {
    type: String,
    default: "",
  },
});

export default mongoose.model<user>("user", userSchema);
