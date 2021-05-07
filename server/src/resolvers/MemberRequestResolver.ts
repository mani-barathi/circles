import { isAuthorized } from "../middlewares/authMiddlewares"
import { Context } from "../types"
import {
  Arg,
  Ctx,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql"
import MemberRequest from "../entities/MemberRequest"
import { EntityNotFoundError, getManager } from "typeorm"

const UNIQUE_CONSTRAINT_ERROR_CODE = "23505"
const FOREIGN_KEY_CONSTRAINT_ERROR_CODE = "23503"

@Resolver()
export default class MemberRequestResolver {
  // returns whether logged in user has sent a member request to the particular circle
  @Query(() => Boolean)
  @UseMiddleware(isAuthorized)
  async isMemberRequestExists(
    @Arg("circleId", () => Int) circleId: number,
    @Ctx() { req }: Context
  ): Promise<Boolean> {
    try {
      const { userId } = req.session
      await MemberRequest.findOneOrFail({
        circleId,
        userId,
      })
      return true
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        return false
      }
      throw new Error("something went wrong")
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuthorized)
  async sendMemberRequest(
    @Arg("circleId", () => Int) circleId: number,
    @Ctx() { req }: Context
  ): Promise<Boolean> {
    const { userId } = req.session
    try {
      const isAlreadyMember = await getManager().query(
        `select exists (select 1 from member where "userId" = $1 and "circleId" = $2)`,
        [userId, circleId]
      )
      if (isAlreadyMember[0].exists) {
        throw new Error("you are already a member of the circle")
      }

      await MemberRequest.insert({
        circleId,
        userId,
      })
      return true
    } catch (e) {
      if (e.code === FOREIGN_KEY_CONSTRAINT_ERROR_CODE) {
        throw new Error("no circle exists")
      }
      if (e.code === UNIQUE_CONSTRAINT_ERROR_CODE) {
        throw new Error("a request is sent already")
      }
      throw e
    }
  }
}
