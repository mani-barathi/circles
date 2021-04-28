import { Request, Response } from "express";
import { Session, SessionData } from "express-session";
import { ObjectType, Field } from "type-graphql";

export type Context = {
  req: Request & {
    session: Session & Partial<SessionData> & { userId: number };
  };
  res: Response;
};

@ObjectType()
export class CustomError {
  @Field()
  path: string;

  @Field()
  message: string;
}
