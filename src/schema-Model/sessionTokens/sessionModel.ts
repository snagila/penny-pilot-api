import sessionSchema from "./sessionSchema";

export const createNewSession = async (session: object) => {
  const newsession = new sessionSchema(session);
  await newsession.save();
  return newsession;
};

// delete all accesstoken session
export const deletePreviousAccessTokens = (userEmail: string) => {
  return sessionSchema.deleteMany({ email: userEmail });
};
// find user by token
export const findUserByToken = (userToken: string) => {
  return sessionSchema.findOne({ token: userToken });
};
