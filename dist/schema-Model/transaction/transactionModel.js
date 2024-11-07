"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTransactions = exports.getAllTransactions = exports.createNewTransaction = void 0;
const transactionSchema_1 = __importDefault(require("./transactionSchema"));
// create new transaction
const createNewTransaction = async (transactionFormObj) => {
    const newTransaction = new transactionSchema_1.default(transactionFormObj);
    await newTransaction.save();
    return newTransaction;
};
exports.createNewTransaction = createNewTransaction;
// get all transactions
const getAllTransactions = async (userEmail) => {
    const allTransactions = await transactionSchema_1.default.find({ userEmail });
    return allTransactions;
};
exports.getAllTransactions = getAllTransactions;
// delete transaction/s
const deleteTransactions = async (idsToDelete) => {
    const deletedTransActions = await transactionSchema_1.default.deleteMany({
        _id: { $in: idsToDelete },
    });
    return deletedTransActions;
};
exports.deleteTransactions = deleteTransactions;
