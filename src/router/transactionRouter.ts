import express, { Request, Response } from "express";
import { authorizeUser } from "../middleWares/authMiddleWare";
import {
  buildErrorRespone,
  buildSuccessRespone,
} from "../utility/responseHelper";
import { createNewTransaction } from "../schema-Model/transaction/transactionModel";

export const transactionRouter = express.Router();

transactionRouter.post(
  "/addtransaction",
  authorizeUser,
  async (req: Request, res: Response) => {
    try {
      const newTransaction = await createNewTransaction({
        ...req.body,
        userId: req.userInfo?._id,
      });
      if (newTransaction) {
        buildSuccessRespone(res, {}, "");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        buildErrorRespone(res, error.message);
      }
    }
  }
);
