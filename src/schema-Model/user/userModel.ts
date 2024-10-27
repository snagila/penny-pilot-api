import userSchema, { user } from "./userSchema";

// find user by E-MAIL
export const findUserByEmail = (userEmail: string) => {
  return userSchema.findOne({ email: userEmail });
};

// create user
export const createNewUser = async (userFormObj: object) => {
  const newUser = new userSchema(userFormObj);
  await newUser.save();
  return newUser;
};

// update user
export const updateUserDetails = async (
  email: string,
  updatePart: Partial<user>
) => {
  return userSchema.findOneAndUpdate(
    { email },
    { $set: updatePart },
    { new: true }
  );
};
