import { CustomError } from "../types";

const USERNAME_REGEX = /^[a-z0-9_]{3,16}$/;
const CIRCLE_NAME_REGEX = /^[a-z0-9_\s]{3,32}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;

export const checkRegisterInputValid = (
  username: string,
  email: string,
  password: string
): CustomError[] => {
  const errors: CustomError[] = [];
  if (!username.toLowerCase().match(USERNAME_REGEX)) {
    errors.push({
      path: "username",
      message:
        "username can contain alphabets, numbers, underscores and must be between 3 and 16 characters",
    });
  }

  if (!email.match(EMAIL_REGEX)) {
    errors.push({ path: "email", message: "provide a valid email" });
  }

  if (password.length < 6 || password.length > 32) {
    errors.push({
      path: "password",
      message: "password must be between 6 and 32 characters",
    });
  }
  return errors;
};

export const checkCircleInputValid = (name: string): CustomError[] => {
  const errors: CustomError[] = [];

  if (!name.toLowerCase().match(CIRCLE_NAME_REGEX)) {
    errors.push({
      path: "name",
      message:
        "name can contain alphabets, numbers, underscores and must be between 3 and 32 characters",
    });
  }

  return errors;
};
