import mongoose, { Document, Schema, Types } from "mongoose";

export interface Transaction extends Document {
  type: string;
  description: string;
  amount: number;
  date: Date;
  userId: Types.ObjectId;
}

const transactionSchema = new Schema<Transaction>({
  type: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 15,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
});

export default mongoose.model<Transaction>("transaction", transactionSchema);
