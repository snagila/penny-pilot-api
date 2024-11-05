import jwt from "jsonwebtoken";
import { createNewSession } from "../schema-Model/sessionTokens/sessionModel";
import { updateUserDetails } from "../schema-Model/user/userModel";

// node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

const accessTokenprivateKey = process.env.JWT_ACCESS_SECRET;
const refreshTokenPrivateKey = process.env.JWT_REFRESH_SECRET;
// accessJWT:session table , exp:15 mins
export const generateAccessJWT = async (email: string) => {
  if (!accessTokenprivateKey) {
    throw new Error(
      "JWT_ACCESS_SECRET is not defined in the environment variables"
    );
  }

  const token = jwt.sign({ email }, accessTokenprivateKey, {
    expiresIn: "30d",
  });
  await createNewSession({ email, token });
  return token;
};

// refreshtoken JWT: user table, exp:30days
export const generateRefreshJWT = async (email: string) => {
  if (!refreshTokenPrivateKey) {
    throw new Error(
      "JWT_REFRESH_SECRET is not defined in the environment variables"
    );
  }
  const token = jwt.sign({ email }, refreshTokenPrivateKey, {
    expiresIn: "30d",
  });
  await updateUserDetails(email, { refreshJWT: token });
  return token;
};

// generate token
export const generateJWTs = async (email: string) => {
  return {
    accessJWT: await generateAccessJWT(email),
    refreshJWT: await generateRefreshJWT(email),
  };
};

// verify accessJWT
export const verifyAccessJWT = (accessJWT: string) => {
  if (!accessTokenprivateKey) {
    throw new Error(
      "JWT_ACCESS_SECRET is not defined in the environment variables"
    );
  }
  return jwt.verify(accessJWT, accessTokenprivateKey);
};

// verify refreshJWT
export const verifyRefreshJWT = (refreshJWT: string) => {
  if (!refreshTokenPrivateKey) {
    throw new Error(
      "JWT_REFRESH_SECRET is not defined in the environment variables"
    );
  }
  return jwt.verify(refreshJWT, refreshTokenPrivateKey);
};
