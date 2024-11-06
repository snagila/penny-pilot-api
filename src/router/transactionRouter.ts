import express, { Request, Response } from "express";
import { authorizeUser } from "../middleWares/authMiddleWare";
import {
  buildErrorRespone,
  buildSuccessRespone,
} from "../utility/responseHelper";
import {
  createNewTransaction,
  deleteTransactions,
  getAllTransactions,
} from "../schema-Model/transaction/transactionModel";

export const transactionRouter = express.Router();

transactionRouter.post(
  "/addtransaction",
  authorizeUser,
  async (req: Request, res: Response) => {
    try {
      const newTransaction = await createNewTransaction({
        ...req.body,
        userEmail: req.userInfo?.email,
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

transactionRouter.get(
  "/",
  authorizeUser,
  async (req: Request, res: Response) => {
    try {
      if (req.userInfo?.email) {
        const allTransactions = await getAllTransactions(req.userInfo?.email);
        if (allTransactions) {
          return buildSuccessRespone(res, allTransactions, "");
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        buildErrorRespone(res, error.message);
      }
    }
  }
);

transactionRouter.delete(
  "/",
  authorizeUser,
  async (req: Request, res: Response) => {
    try {
      const deleteTransaction = await deleteTransactions(req.body);
      if (deleteTransaction) {
        return buildSuccessRespone(res, deleteTransaction, "");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        buildErrorRespone(res, error.message);
      }
    }
  }
);
