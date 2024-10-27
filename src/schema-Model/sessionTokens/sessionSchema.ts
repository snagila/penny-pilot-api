import mongoose, { Document, Schema } from "mongoose";

export interface Session extends Document {
  email: string;
  token: string;
}

const sessionSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
});

export default mongoose.model<Session>("session", sessionSchema);
