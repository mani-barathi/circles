import User from "../entities/User";
import { Resolver, FieldResolver, Root, Query } from "type-graphql";

@Resolver(User)
export default class UserResolver {
  @FieldResolver(() => String)
  email(@Root() parent: User): string {
    return `${parent.name}.email.com`;
  }

  @Query(() => User)
  getUser(): User {
    return new User("john");
  }
}
