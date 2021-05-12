import Post from "../entities/Post"
import { Arg, Authorized, Ctx, Int, Mutation, Resolver } from "type-graphql"
import { Context } from "../types"
import { getManager } from "typeorm"

@Resolver()
export default class PostResolver {
  @Mutation(() => Post)
  @Authorized(["MEMBER"])
  async createPost(
    @Arg("text", () => String) text: string,
    @Arg("circleId", () => Int) circleId: number,
    @Ctx() { req }: Context
  ): Promise<Post> {
    const { userId } = req.session

    if (text.length < 0 || text.length > 2000)
      throw new Error("text should be between 1 and 2000 characters")

    const post = await getManager().transaction(async (tm) => {
      const newPost = await tm
        .create(Post, {
          circleId,
          creatorId: userId,
          text,
        })
        .save()
      await tm.query(`update circle set "updatedAt" = now() where id = $1`, [
        circleId,
      ])
      return newPost
    })
    return post
  }
}
