import {
  Arg,
  Authorized,
  Ctx,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql"
import { EntityNotFoundError, getManager } from "typeorm"
import MemberRequest from "../entities/MemberRequest"
import Member from "../entities/Member"
import { isAuthorized } from "../middlewares/authMiddlewares"
import { Context, createPaginatedResponse } from "../types"
import {
  FOREIGN_KEY_CONSTRAINT_ERROR_CODE,
  UNIQUE_CONSTRAINT_ERROR_CODE,
} from "../constants"

const PaginatedMemberRequests = createPaginatedResponse(MemberRequest)
type PaginatedMemberRequests = InstanceType<typeof PaginatedMemberRequests>

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

  @Query(() => PaginatedMemberRequests)
  @UseMiddleware(isAuthorized)
  async memberRequests(
    @Arg("circleId", () => Int) circleId: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedMemberRequests> {
    try {
      const limit = 25
      const limitPlusOne = limit + 1
      const replacements: any[] = [circleId, limitPlusOne]
      if (cursor) {
        replacements.push(new Date(parseInt(cursor)))
      }

      const requests: any[] = await getManager().query(
        `
        select mr.*,
          json_build_object(
            'id',u.id,
            'username',u.username
        ) as "user"
        from member_request mr inner join "user" u on u.id = mr."userId"
        where mr."circleId" = $1 
        ${cursor ? 'and mr."createdAt" < $3' : ""}
        order by mr."createdAt" DESC LIMIt $2
      `,
        replacements
      )
      return {
        hasMore: requests.length === limitPlusOne,
        data: requests.slice(0, limit),
      }
    } catch (e) {
      throw new Error("something went wrong")
    }
  }

  @Mutation(() => Boolean)
  @Authorized(["ADMIN"])
  async acceptMemberRequest(
    @Arg("memberId", () => Int) memberId: number,
    @Arg("circleId", () => Int) circleId: number
  ): Promise<Boolean> {
    try {
      await getManager().transaction(async (tm) => {
        const deleted = await tm.delete(MemberRequest, {
          circleId,
          userId: memberId,
        })
        if (deleted.affected !== 1 || !deleted.affected) {
          throw new EntityNotFoundError(MemberRequest, {})
        }

        await tm.insert(Member, { circleId, userId: memberId, isAdmin: false })

        await tm.query(
          `update circle set "totalMembers" = "totalMembers" + 1 where id = $1 returning id,name`,
          [circleId]
        )
      }) // end of transaction
      return true
    } catch (e) {
      if (e.code === UNIQUE_CONSTRAINT_ERROR_CODE) {
        throw new Error("the person is already a member of the circle")
      }
      if (e instanceof EntityNotFoundError) {
        throw new Error("no member request found")
      }
      throw new Error("something went wrong")
    }
  }

  @Mutation(() => Boolean)
  @Authorized(["ADMIN"])
  async declineMemberRequest(
    @Arg("memberId", () => Int) memberId: number,
    @Arg("circleId", () => Int) circleId: number
  ): Promise<Boolean> {
    try {
      await MemberRequest.delete({
        circleId,
        userId: memberId,
      })
      return true
    } catch (e) {
      throw new Error("something went wrong")
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuthorized)
  async cancelMemberRequest(
    @Arg("circleId", () => Int) circleId: number,
    @Ctx() { req }: Context
  ): Promise<Boolean> {
    const { userId } = req.session
    await MemberRequest.delete({ circleId, userId })
    return true
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
