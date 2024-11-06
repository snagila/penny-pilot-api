import transactionSchema from "./transactionSchema";
import { ObjectId } from "mongoose";

// create new transaction
export const createNewTransaction = async (transactionFormObj: object) => {
  const newTransaction = new transactionSchema(transactionFormObj);
  await newTransaction.save();
  return newTransaction;
};

// get all transactions
export const getAllTransactions = async (userEmail: String) => {
  const allTransactions = await transactionSchema.find({ userEmail });
  return allTransactions;
};

// delete transaction/s
export const deleteTransactions = async (idsToDelete: string[]) => {
  const deletedTransActions = await transactionSchema.deleteMany({
    _id: { $in: idsToDelete },
  });
  return deletedTransActions;
};
