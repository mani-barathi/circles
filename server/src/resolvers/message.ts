import { Arg, Authorized, Ctx, Int, Mutation, Resolver } from "type-graphql"
import Message from "../entities/Message"
import { Context } from "../types"

@Resolver(Message)
export default class PostResolver {
  @Mutation(() => Boolean)
  @Authorized(["MEMBER"])
  async sendMessage(
    @Arg("text", () => String) text: string,
    @Arg("circleId", () => Int) circleId: number,
    @Ctx() { req }: Context
  ): Promise<Boolean> {
    const { userId } = req.session
    if (text.length === 0) return false

    await Message.create({ circleId, authorId: userId, text }).save()
    return true
  }
}
