import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Int,
  Field,
  ObjectType,
} from "type-graphql";
import argon2 from "argon2";
import User from "../entities/User";
import { CustomError } from "../types";
import { checkRegisterInputValid } from "../utils/validations";

const UNIQUE_CONSTRAINT_ERROR_CODE = "23505";

@ObjectType()
class UserResponse {
  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];
}

@Resolver()
export default class UserResolver {
  @Query(() => Int)
  getRandomNumber(): number {
    return Math.floor(Math.random() * 100);
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("username") username: string,
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<UserResponse> {
    try {
      const errors = checkRegisterInputValid(username, email, password);
      if (errors.length > 0) {
        return { errors };
      }
      const hashedPassword = await argon2.hash(password);
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
      }).save();
      return { user };
    } catch (e) {
      if (e.code === UNIQUE_CONSTRAINT_ERROR_CODE) {
        const field = e.detail.includes("email") ? "email" : "username";
        return { errors: [{ path: field, message: `${field} is taken` }] };
      }
      return { errors: [{ path: "unkown", message: "something went wrong" }] };
    }
  }
}
