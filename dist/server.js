"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const dbConfig_1 = require("./config/dbConfig");
const authRouter_1 = require("./router/authRouter");
const transactionRouter_1 = require("./router/transactionRouter");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8001;
// middlewares
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Routes
app.use("/auth", authRouter_1.authRouter);
app.use("/transaction", transactionRouter_1.transactionRouter);
// connect to database
(0, dbConfig_1.connectToMongoDb)();
// start the server
app.listen(PORT, () => {
    console.log(`Server running at port: ${PORT}`);
});
