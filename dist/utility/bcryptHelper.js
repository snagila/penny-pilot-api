"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const SALT = 10;
const hashPassword = (normalPassword) => {
    const hashedPassword = bcryptjs_1.default.hashSync(normalPassword, SALT);
    return hashedPassword;
};
exports.hashPassword = hashPassword;
const comparePassword = (plainPassword, hashPassword) => {
    return bcryptjs_1.default.compareSync(plainPassword, hashPassword);
};
exports.comparePassword = comparePassword;
