"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserByToken = exports.deletePreviousAccessTokens = exports.createNewSession = void 0;
const sessionSchema_1 = __importDefault(require("./sessionSchema"));
const createNewSession = async (session) => {
    const newsession = new sessionSchema_1.default(session);
    await newsession.save();
    return newsession;
};
exports.createNewSession = createNewSession;
// delete all accesstoken session
const deletePreviousAccessTokens = (userEmail) => {
    return sessionSchema_1.default.deleteMany({ email: userEmail });
};
exports.deletePreviousAccessTokens = deletePreviousAccessTokens;
// find user by token
const findUserByToken = (userToken) => {
    return sessionSchema_1.default.findOne({ token: userToken });
};
exports.findUserByToken = findUserByToken;
