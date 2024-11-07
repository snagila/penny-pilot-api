"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const uuid_1 = require("uuid");
const bcryptHelper_1 = require("../utility/bcryptHelper");
const userModel_1 = require("../schema-Model/user/userModel");
const responseHelper_1 = require("../utility/responseHelper");
const sessionModel_1 = require("../schema-Model/sessionTokens/sessionModel");
const nodemailerHelper_1 = require("../utility/nodemailerHelper");
const jwtHelper_1 = require("../utility/jwtHelper");
const authMiddleWare_1 = require("../middleWares/authMiddleWare");
exports.authRouter = express_1.default.Router();
exports.authRouter.post("/signup", async (req, res) => {
    try {
        const { password, email, ...rest } = req.body;
        const existingUser = await (0, userModel_1.findUserByEmail)(email);
        if (existingUser) {
            (0, responseHelper_1.buildErrorRespone)(res, "User already exists with this email.");
            return;
        }
        if (!existingUser) {
            const hashedPassword = (0, bcryptHelper_1.hashPassword)(password);
            if (hashedPassword) {
                const newUser = await (0, userModel_1.createNewUser)({
                    ...rest,
                    email,
                    password: hashedPassword,
                });
                if (newUser?._id) {
                    const secureID = (0, uuid_1.v4)();
                    const newUserSession = await (0, sessionModel_1.createNewSession)({
                        email: email,
                        token: secureID,
                    });
                    // console.log(newUser);
                    if (newUserSession._id) {
                        const verificationUrl = `${process.env.CLIENT_ROOT_URL}/verify-email?e=${newUser.email}&id=${secureID}`;
                        // sending email with the help of nodemailer
                        (0, nodemailerHelper_1.sendVerificationLinkEmail)(newUser, verificationUrl);
                    }
                    newUser._id
                        ? (0, responseHelper_1.buildSuccessRespone)(res, {}, "Please check your email inbox/spam to verify your account.")
                        : (0, responseHelper_1.buildErrorRespone)(res, "Could not create user.Please contact administrator.");
                }
            }
        }
    }
    catch (error) {
        if (error.code === "E11000") {
            error.message = "User with this email already exists.";
        }
        if (error instanceof Error) {
            console.log(error.message);
            (0, responseHelper_1.buildErrorRespone)(res, error.message);
        }
    }
});
// verify user from the email
exports.authRouter.post("/verifyuser", async (req, res) => {
    try {
        const { userEmail, sessionToken } = req.body;
        const [findUser, findToken] = await Promise.all([
            (0, userModel_1.findUserByEmail)(userEmail),
            (0, sessionModel_1.findUserByToken)(sessionToken),
        ]);
        if (!findToken || !findUser) {
            return (0, responseHelper_1.buildErrorRespone)(res, "Can not verify user. Please contact admin.");
        }
        if (findUser && findToken) {
            const [deleteToken, updateUserVerification] = await Promise.all([
                (0, sessionModel_1.deletePreviousAccessTokens)(userEmail),
                (0, userModel_1.updateUserDetails)(userEmail, { verified: true }),
            ]);
            const loginUrl = `${process.env.CLIENT_ROOT_URL}`;
            (0, nodemailerHelper_1.sendAccountVerifiedEmail)(findUser, loginUrl);
            return (0, responseHelper_1.buildSuccessRespone)(res, {}, "Thank You for verifying your account.");
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
            (0, responseHelper_1.buildErrorRespone)(res, error.message);
        }
    }
});
// send reset password email
exports.authRouter.post("/reset-password", async (req, res) => {
    try {
        const { email } = req.body;
        const secureID = (0, uuid_1.v4)();
        const user = await (0, userModel_1.findUserByEmail)(email);
        if (!user) {
            return (0, responseHelper_1.buildErrorRespone)(res, "Please enter valid email.");
        }
        if (user) {
            const passWordResetUrl = `${process.env.CLIENT_ROOT_URL}/new-Password?e=${email}&id=${secureID}`;
            await (0, sessionModel_1.createNewSession)({ email, token: secureID });
            (0, nodemailerHelper_1.sendResetPasswordEmail)(user, passWordResetUrl);
            console.log(user);
            (0, responseHelper_1.buildSuccessRespone)(res, {}, "Password reset Email sent.");
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
            (0, responseHelper_1.buildErrorRespone)(res, error.message);
        }
    }
});
// change new password
exports.authRouter.post("/new-Password", async (req, res) => {
    try {
        const { newPassword, email, token } = req.body;
        const [userCheck, tokenCheck] = await Promise.all([
            (0, userModel_1.findUserByEmail)(email),
            (0, sessionModel_1.findUserByToken)(token),
        ]);
        if (!userCheck || !tokenCheck) {
            return (0, responseHelper_1.buildErrorRespone)(res, "Invalid credentials. Please contact admin.");
        }
        if (userCheck && tokenCheck) {
            const hashedPassWord = (0, bcryptHelper_1.hashPassword)(newPassword);
            const [changePassword, deleteToken] = await Promise.all([
                (0, userModel_1.updateUserDetails)(email, { password: hashedPassWord }),
                (0, sessionModel_1.deletePreviousAccessTokens)(email),
            ]);
            if (!changePassword || !deleteToken) {
                return (0, responseHelper_1.buildErrorRespone)(res, "Something went wrong. Please try again.");
            }
            if (changePassword) {
                const loginURL = `${process.env.CLIENT_ROOT_URL}`;
                (0, nodemailerHelper_1.sendPasswordChanged)(userCheck, loginURL);
                return (0, responseHelper_1.buildSuccessRespone)(res, {}, "Password changed successfully.");
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
// loginUser
exports.authRouter.post("/login", async (req, res) => {
    try {
        const { email, password: plainPassword } = req.body;
        const findUser = await (0, userModel_1.findUserByEmail)(email);
        if (!findUser) {
            throw new Error("Invalid credentials ");
        }
        if (findUser && findUser._id) {
            const passwordMatch = (0, bcryptHelper_1.comparePassword)(plainPassword, findUser.password);
            // THIS IS THE AY TO CONVERT MONGOOSE RETURN FILE INTO OBJECT FORMAT
            // const userObj = findUser.toObject();
            // const { password, ...rest } = userObj;
            if (!passwordMatch) {
                throw new Error("Invalid Credentials");
            }
            if (passwordMatch) {
                const jwts = await (0, jwtHelper_1.generateJWTs)(email);
                return (0, responseHelper_1.buildSuccessRespone)(res, jwts, "");
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
// get user Details
exports.authRouter.get("/", authMiddleWare_1.authorizeUser, (req, res) => {
    try {
        (0, responseHelper_1.buildSuccessRespone)(res, req.userInfo, "");
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(error);
            (0, responseHelper_1.buildErrorRespone)(res, error.message);
        }
    }
});
// logout user
exports.authRouter.post("/logout", authMiddleWare_1.authorizeUser, async (req, res) => {
    try {
        if (req.userInfo) {
            const { email } = req.userInfo;
            console.log(email);
            if (email) {
                const [deleteSession, deleteRefreshJwt] = await Promise.all([
                    (0, sessionModel_1.deletePreviousAccessTokens)(email),
                    (0, userModel_1.updateUserDetails)(email, { refreshJWT: "" }),
                ]);
                if (deleteSession && deleteRefreshJwt) {
                    (0, responseHelper_1.buildSuccessRespone)(res, "", "");
                }
            }
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(error);
            (0, responseHelper_1.buildErrorRespone)(res, error.message);
        }
    }
});
