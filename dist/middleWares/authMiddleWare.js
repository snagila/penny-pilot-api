"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeUser = void 0;
const jwtHelper_1 = require("../utility/jwtHelper");
const userModel_1 = require("../schema-Model/user/userModel");
const responseHelper_1 = require("../utility/responseHelper");
const authorizeUser = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;
        if (authorization) {
            const verifyToken = (0, jwtHelper_1.verifyAccessJWT)(authorization);
            if (!verifyToken) {
                throw new Error("Invalid token, Unauthorized.");
            }
            const user = (await (0, userModel_1.findUserByEmail)(verifyToken.email));
            if (user) {
                req.userInfo = {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone,
                    verified: user.verified,
                    refreshJWT: user.refreshJWT,
                };
                next();
            }
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
            (0, responseHelper_1.buildErrorRespone)(res, error.message);
        }
    }
};
exports.authorizeUser = authorizeUser;
