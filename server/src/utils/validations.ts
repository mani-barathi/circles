import { CustomError } from "../types";

export const checkRegisterInputValid = (
  username: string,
  email: string,
  password: string
): CustomError[] | void => {
  const errors = [];
  if (username.length < 3) {
    errors.push({
      path: "username",
      message: "username must be alteast be 3 characters",
    });
  }

  if (!email.includes("@")) {
    errors.push({ path: "email", message: "provide a valid email" });
  }

  if (password.length < 6 || password.length > 25) {
    errors.push({
      path: "password",
      message: "password must be between 6 and 25 characters",
    });
  }
  return errors;
};
