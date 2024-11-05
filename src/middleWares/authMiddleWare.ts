import { NextFunction, Request, Response } from "express";
import { verifyAccessJWT } from "../utility/jwtHelper";
import { findUserByEmail } from "../schema-Model/user/userModel";
import { JwtPayload } from "jsonwebtoken";
import { ObjectId } from "mongoose";
import { user } from "../schema-Model/user/userSchema";
import { buildErrorRespone } from "../utility/responseHelper";

declare global {
  namespace Express {
    interface Request {
      userInfo?: {
        _id?: ObjectId;
        firstName?: string;
        lastName?: string;
        email?: string;
        phone?: number;
        verified?: boolean;
        refreshJWT?: string;
      };
    }
  }
}

export const authorizeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorization = req.headers.authorization;
    if (authorization) {
      const verifyToken = verifyAccessJWT(authorization) as JwtPayload;
      if (!verifyToken) {
        throw new Error("Invalid token, Unauthorized.");
      }
      const user = (await findUserByEmail(verifyToken.email)) as user;

      if (user) {
        req.userInfo = {
          _id: user._id as ObjectId,
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
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      buildErrorRespone(res, error.message);
    }
  }
};
