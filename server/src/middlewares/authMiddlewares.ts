import { Context } from "../types";
import { MiddlewareFn } from "type-graphql";

export const isAuthorized: MiddlewareFn<Context> = ({ context }, next) => {
  if (!context.req.session.userId) {
    throw new Error("not authorized");
  }
  return next();
};

export const isUnAuthorized: MiddlewareFn<Context> = ({ context }, next) => {
  if (context.req.session.userId) {
    throw new Error("invalid request");
  }
  return next();
};
