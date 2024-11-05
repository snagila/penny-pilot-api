import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectToMongoDb } from "./config/dbConfig";
import { authRouter } from "./router/authRouter";
import { transactionRouter } from "./router/transactionRouter";

const app = express();
const PORT = process.env.PORT || 8001;

// middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/auth", authRouter);
app.use("/transaction", transactionRouter);

// connect to database
connectToMongoDb();

// start the server
app.listen(PORT, () => {
  console.log(`Server running at port: ${PORT}`);
});
