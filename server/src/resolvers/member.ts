import { Arg, Ctx, Int, Mutation, Query, UseMiddleware } from "type-graphql"
import { EntityNotFoundError, getConnection, getManager } from "typeorm"
import Member from "../entities/Member"
import { isAuthorized } from "../middlewares/authMiddlewares"
import { Context, createPaginatedResponse } from "../types"

const PaginatedMembers = createPaginatedResponse(Member)
type PaginatedMembers = InstanceType<typeof PaginatedMembers>

export default class MemberResolver {
  @Query(() => PaginatedMembers)
  @UseMiddleware(isAuthorized)
  async members(
    @Arg("circleId", () => Int) circleId: Number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedMembers> {
    const limit = 2
    const take = limit + 1
    const replacements: any[] = [circleId, take]
    if (cursor) {
      replacements.push(new Date(parseInt(cursor) + 1))
    }
    const members: any[] = await getConnection().query(
      ` SELECT m.*, u.username FROM member m INNER JOIN "user" u ON u.id = m."userId" 
      WHERE m."circleId" = $1  
      ${cursor ? `AND m."createdAt" > $3` : ""} 
      ORDER BY m."createdAt" LIMIT $2
    `,
      replacements
    )

    const formatedMembers: Member[] = members.map((m) => ({
      ...m,
      user: {
        id: m.userId,
        username: m.username,
      },
    }))
    return {
      data: formatedMembers.slice(0, limit),
      hasMore: formatedMembers.length === take,
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuthorized)
  async removeMember(
    @Arg("circleId", () => Int) circleId: number,
    @Arg("memberId", () => Int) memberId: number,
    @Ctx() { req }: Context
  ): Promise<Boolean> {
    const { userId } = req.session
    try {
      await Member.findOneOrFail({ circleId, userId, isAdmin: true })
      const deleted = await Member.delete({ userId: memberId, circleId })

      if (deleted.affected !== 1 || !deleted.affected) {
        return true
      }

      await getManager().query(
        `update circle set "totalMembers" = "totalMembers" - 1 where id = $1`,
        [circleId]
      )
      return true
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new Error("Un Authorized access")
      }
      throw new Error("something went wrong!")
    }
  }
}
