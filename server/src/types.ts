import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class CustomError {
  @Field()
  path: string;

  @Field()
  message: string;
}
