"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshJWT = exports.verifyAccessJWT = exports.generateJWTs = exports.generateRefreshJWT = exports.generateAccessJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sessionModel_1 = require("../schema-Model/sessionTokens/sessionModel");
const userModel_1 = require("../schema-Model/user/userModel");
// node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
const accessTokenprivateKey = process.env.JWT_ACCESS_SECRET;
const refreshTokenPrivateKey = process.env.JWT_REFRESH_SECRET;
// accessJWT:session table , exp:15 mins
const generateAccessJWT = async (email) => {
    if (!accessTokenprivateKey) {
        throw new Error("JWT_ACCESS_SECRET is not defined in the environment variables");
    }
    const token = jsonwebtoken_1.default.sign({ email }, accessTokenprivateKey, {
        expiresIn: "30d",
    });
    await (0, sessionModel_1.createNewSession)({ email, token });
    return token;
};
exports.generateAccessJWT = generateAccessJWT;
// refreshtoken JWT: user table, exp:30days
const generateRefreshJWT = async (email) => {
    if (!refreshTokenPrivateKey) {
        throw new Error("JWT_REFRESH_SECRET is not defined in the environment variables");
    }
    const token = jsonwebtoken_1.default.sign({ email }, refreshTokenPrivateKey, {
        expiresIn: "30d",
    });
    await (0, userModel_1.updateUserDetails)(email, { refreshJWT: token });
    return token;
};
exports.generateRefreshJWT = generateRefreshJWT;
// generate token
const generateJWTs = async (email) => {
    return {
        accessJWT: await (0, exports.generateAccessJWT)(email),
        refreshJWT: await (0, exports.generateRefreshJWT)(email),
    };
};
exports.generateJWTs = generateJWTs;
// verify accessJWT
const verifyAccessJWT = (accessJWT) => {
    if (!accessTokenprivateKey) {
        throw new Error("JWT_ACCESS_SECRET is not defined in the environment variables");
    }
    return jsonwebtoken_1.default.verify(accessJWT, accessTokenprivateKey);
};
exports.verifyAccessJWT = verifyAccessJWT;
// verify refreshJWT
const verifyRefreshJWT = (refreshJWT) => {
    if (!refreshTokenPrivateKey) {
        throw new Error("JWT_REFRESH_SECRET is not defined in the environment variables");
    }
    return jsonwebtoken_1.default.verify(refreshJWT, refreshTokenPrivateKey);
};
exports.verifyRefreshJWT = verifyRefreshJWT;
