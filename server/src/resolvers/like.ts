import { Arg, Authorized, Ctx, Int, Mutation, Resolver } from "type-graphql"
import { getManager } from "typeorm"
import { UNIQUE_CONSTRAINT_ERROR_CODE } from "../constants"
import Like from "../entities/Like"
import { Context } from "../types"

@Resolver()
export default class LikeResolver {
  @Mutation(() => Boolean)
  @Authorized(["MEMBER"])
  async likeOrDislike(
    @Arg("postId", () => Int) postId: number,
    @Arg("circleId", () => Int) circleId: number,
    @Arg("isDislike", () => Boolean) isDislike: Boolean,
    @Ctx() { req }: Context
  ): Promise<Boolean> {
    const { userId } = req.session

    try {
      // to check whether the post belongs to circle
      const [record] = await getManager().query(
        `
      select exists (select 1 from post where id = $1 and "circleId" = $2 )
      `,
        [postId, circleId]
      )
      if (!record.exists) {
        throw new Error("post does not exists or does not belong to circle")
      }

      // isDislike - true  --> user has already liked and now disliking the post
      // isDislike - false --> user liking the post for the first time
      if (isDislike) {
        await getManager().transaction(async (tm) => {
          const deleted = await tm.delete(Like, { postId, userId, circleId })
          if (deleted.affected === 1) {
            await tm.query(
              `
            update post set "likesCount" = "likesCount" - 1 where id = $1 and "circleId" = $2
          `,
              [postId, circleId]
            )
          } else {
            throw new Error("no previous like found")
          }
        })
      } else {
        await getManager().transaction(async (tm) => {
          await tm.insert(Like, { postId, userId, circleId })
          await tm.query(
            `
            update post set "likesCount" = "likesCount" + 1 where  id = $1 and "circleId" = $2
          `,
            [postId, circleId]
          )
        })
      }
      return true
    } catch (e) {
      if (e.code === UNIQUE_CONSTRAINT_ERROR_CODE) {
        throw new Error("you have already liked the post")
      }
      throw e
    }
  }
}
