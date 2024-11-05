import transactionSchema from "./transactionSchema";

// create new transaction
export const createNewTransaction = async (transactionFormObj: object) => {
  const newTransaction = new transactionSchema(transactionFormObj);
  await newTransaction.save();
  return newTransaction;
};
