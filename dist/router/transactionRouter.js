"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionRouter = void 0;
const express_1 = __importDefault(require("express"));
const authMiddleWare_1 = require("../middleWares/authMiddleWare");
const responseHelper_1 = require("../utility/responseHelper");
const transactionModel_1 = require("../schema-Model/transaction/transactionModel");
exports.transactionRouter = express_1.default.Router();
exports.transactionRouter.post("/addtransaction", authMiddleWare_1.authorizeUser, async (req, res) => {
    try {
        const newTransaction = await (0, transactionModel_1.createNewTransaction)({
            ...req.body,
            userEmail: req.userInfo?.email,
        });
        if (newTransaction) {
            (0, responseHelper_1.buildSuccessRespone)(res, {}, "");
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
            (0, responseHelper_1.buildErrorRespone)(res, error.message);
        }
    }
});
exports.transactionRouter.get("/", authMiddleWare_1.authorizeUser, async (req, res) => {
    try {
        if (req.userInfo?.email) {
            const allTransactions = await (0, transactionModel_1.getAllTransactions)(req.userInfo?.email);
            if (allTransactions) {
                return (0, responseHelper_1.buildSuccessRespone)(res, allTransactions, "");
            }
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
            (0, responseHelper_1.buildErrorRespone)(res, error.message);
        }
    }
});
exports.transactionRouter.delete("/", authMiddleWare_1.authorizeUser, async (req, res) => {
    try {
        const deleteTransaction = await (0, transactionModel_1.deleteTransactions)(req.body);
        if (deleteTransaction) {
            return (0, responseHelper_1.buildSuccessRespone)(res, deleteTransaction, "");
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
            (0, responseHelper_1.buildErrorRespone)(res, error.message);
        }
    }
});
