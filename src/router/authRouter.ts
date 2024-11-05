import express, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { comparePassword, hashPassword } from "../utility/bcryptHelper";
import {
  createNewUser,
  findUserByEmail,
  updateUserDetails,
} from "../schema-Model/user/userModel";
import {
  buildErrorRespone,
  buildSuccessRespone,
} from "../utility/responseHelper";
import {
  createNewSession,
  deletePreviousAccessTokens,
  findUserByToken,
} from "../schema-Model/sessionTokens/sessionModel";
import {
  sendAccountVerifiedEmail,
  sendPasswordChanged,
  sendResetPasswordEmail,
  sendVerificationLinkEmail,
} from "../utility/nodemailerHelper";
import { generateJWTs } from "../utility/jwtHelper";
import { authorizeUser } from "../middleWares/authMiddleWare";

export const authRouter = express.Router();

authRouter.post("/signup", async (req: Request, res: Response) => {
  try {
    const { password, email, ...rest } = req.body;
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      buildErrorRespone(res, "User already exists with this email.");
      return;
    }
    if (!existingUser) {
      const hashedPassword = hashPassword(password);
      if (hashedPassword) {
        const newUser = await createNewUser({
          ...rest,
          email,
          password: hashedPassword,
        });
        if (newUser?._id) {
          const secureID = uuidv4();
          const newUserSession = await createNewSession({
            email: email,
            token: secureID,
          });
          // console.log(newUser);

          if (newUserSession._id) {
            const verificationUrl = `${process.env.CLIENT_ROOT_URL}/verify-email?e=${newUser.email}&id=${secureID}`;
            // sending email with the help of nodemailer
            sendVerificationLinkEmail(newUser, verificationUrl);
          }
          newUser._id
            ? buildSuccessRespone(
                res,
                {},
                "Please check your email inbox/spam to verify your account."
              )
            : buildErrorRespone(
                res,
                "Could not create user.Please contact administrator."
              );
        }
      }
    }
  } catch (error) {
    if ((error as any).code === "E11000") {
      (error as any).message = "User with this email already exists.";
    }
    if (error instanceof Error) {
      console.log(error.message);
      buildErrorRespone(res, error.message);
    }
  }
});

interface VerifyUserBody {
  userEmail: string;
  sessionToken: string;
}

// verify user from the email
authRouter.post("/verifyuser", async (req: Request, res: Response) => {
  try {
    const { userEmail, sessionToken } = req.body as VerifyUserBody;
    const [findUser, findToken] = await Promise.all([
      findUserByEmail(userEmail),
      findUserByToken(sessionToken),
    ]);
    if (!findToken || !findUser) {
      return buildErrorRespone(
        res,
        "Can not verify user. Please contact admin."
      );
    }
    if (findUser && findToken) {
      const [deleteToken, updateUserVerification] = await Promise.all([
        deletePreviousAccessTokens(userEmail),
        updateUserDetails(userEmail, { verified: true }),
      ]);
      const loginUrl = `${process.env.CLIENT_ROOT_URL}`;
      sendAccountVerifiedEmail(findUser, loginUrl);
      return buildSuccessRespone(res, {}, "");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      buildErrorRespone(res, error.message);
    }
  }
});

// send reset password email
authRouter.post("/reset-password", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const secureID = uuidv4();
    const user = await findUserByEmail(email);
    if (!user) {
      return buildErrorRespone(res, "Please enter valid email.");
    }
    if (user) {
      const passWordResetUrl = `${process.env.CLIENT_ROOT_URL}/new-Password?e=${email}&id=${secureID}`;
      await createNewSession({ email, token: secureID });
      sendResetPasswordEmail(user, passWordResetUrl);
      console.log(user);
      buildSuccessRespone(res, {}, "Password reset Email sent.");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      buildErrorRespone(res, error.message);
    }
  }
});

// change new password
authRouter.post("/new-Password", async (req: Request, res: Response) => {
  try {
    const { newPassword, email, token } = req.body;
    const [userCheck, tokenCheck] = await Promise.all([
      findUserByEmail(email),
      findUserByToken(token),
    ]);
    if (!userCheck || !tokenCheck) {
      return buildErrorRespone(
        res,
        "Invalid credentials. Please contact admin."
      );
    }
    if (userCheck && tokenCheck) {
      const hashedPassWord = hashPassword(newPassword);
      const [changePassword, deleteToken] = await Promise.all([
        updateUserDetails(email, { password: hashedPassWord }),
        deletePreviousAccessTokens(email),
      ]);
      if (!changePassword || !deleteToken) {
        return buildErrorRespone(
          res,
          "Something went wrong. Please try again."
        );
      }
      if (changePassword) {
        const loginURL = `${process.env.CLIENT_ROOT_URL}`;
        sendPasswordChanged(userCheck, loginURL);
        return buildSuccessRespone(res, {}, "Password changed successfully.");
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      buildErrorRespone(res, error.message);
    }
  }
});

// loginUser
authRouter.post("/login", async (req: Request, res: Response) => {
  const { email, password: plainPassword } = req.body;
  const findUser = await findUserByEmail(email);
  if (!findUser) {
    throw new Error("Invalid credentials");
  }
  if (findUser && findUser._id) {
    const passwordMatch = comparePassword(plainPassword, findUser.password);

    // THIS IS THE AY TO CONVERT MONGOOSE RETURN FILE INTO OBJECT FORMAT
    // const userObj = findUser.toObject();
    // const { password, ...rest } = userObj;

    if (!passwordMatch) {
      throw new Error("Invalid Credentials");
    }
    if (passwordMatch) {
      const jwts = await generateJWTs(email);
      return buildSuccessRespone(res, jwts, "");
    }
  }
  try {
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      buildErrorRespone(res, error.message);
    }
  }
});

// get user Details
authRouter.get("/", authorizeUser, (req: Request, res: Response) => {
  try {
    buildSuccessRespone(res, req.userInfo, "");
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      buildErrorRespone(res, error.message);
    }
  }
});

// logout user
authRouter.post(
  "/logout",
  authorizeUser,
  async (req: Request, res: Response) => {
    try {
      if (req.userInfo) {
        const { email } = req.userInfo;
        console.log(email);
        if (email) {
          const [deleteSession, deleteRefreshJwt] = await Promise.all([
            deletePreviousAccessTokens(email),
            updateUserDetails(email, { refreshJWT: "" }),
          ]);
          if (deleteSession && deleteRefreshJwt) {
            buildSuccessRespone(res, "", "");
          }
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        buildErrorRespone(res, error.message);
      }
    }
  }
);
