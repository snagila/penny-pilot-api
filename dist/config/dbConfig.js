"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToMongoDb = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectToMongoDb = async () => {
    try {
        await mongoose_1.default.connect(`${process.env.DB_CONNECT_URL}`, {});
        console.log("MongoDB Connected");
    }
    catch (error) {
        if (error instanceof Error) {
            console.log("Error:", error.message);
        }
        else {
            console.log("An error occured");
        }
        process.exit(1);
    }
};
exports.connectToMongoDb = connectToMongoDb;
