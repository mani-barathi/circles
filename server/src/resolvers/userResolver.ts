import User from "../entities/User";
import { Resolver, Query, Mutation, Arg, Int, Field } from "type-graphql";

@Resolver()
export default class UserResolver {
  @Query(() => Int)
  getRandomNumber(): number {
    return Math.floor(Math.random() * 100);
  }

  @Mutation(() => User)
  async register(
    @Arg("username") username: string,
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<User> {
    try {
      return await User.create({ username, email, password }).save();
    } catch (e) {
      console.log(typeof e);
      console.log(e);
      throw e;
    }
  }
}
