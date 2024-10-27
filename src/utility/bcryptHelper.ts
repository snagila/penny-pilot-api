import bcrypt from "bcryptjs";

const SALT = 10;

export const hashPassword = (normalPassword: string) => {
  const hashedPassword = bcrypt.hashSync(normalPassword, SALT);
  return hashedPassword;
};

export const comparePassword = (
  plainPassword: string,
  hashPassword: string
) => {
  return bcrypt.compareSync(plainPassword, hashPassword);
};
