import mongoose from "mongoose";

export const connectToMongoDb = async () => {
  try {
    await mongoose.connect(`${process.env.DB_CONNECT_URL}`, {});
    console.log("MongoDB Connected");
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error:", error.message);
    } else {
      console.log("An error occured");
    }
    process.exit(1);
  }
};
