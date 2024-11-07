"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserDetails = exports.createNewUser = exports.findUserByEmail = void 0;
const userSchema_1 = __importDefault(require("./userSchema"));
// find user by E-MAIL
const findUserByEmail = (userEmail) => {
    return userSchema_1.default.findOne({ email: userEmail });
};
exports.findUserByEmail = findUserByEmail;
// create user
const createNewUser = async (userFormObj) => {
    const newUser = new userSchema_1.default(userFormObj);
    await newUser.save();
    return newUser;
};
exports.createNewUser = createNewUser;
// update user
const updateUserDetails = async (email, updatePart) => {
    return userSchema_1.default.findOneAndUpdate({ email }, { $set: updatePart }, { new: true });
};
exports.updateUserDetails = updateUserDetails;
