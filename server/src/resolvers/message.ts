import {
  Arg,
  Authorized,
  Ctx,
  Int,
  Mutation,
  Query,
  Resolver,
} from "type-graphql"
import { getConnection } from "typeorm"
import Message from "../entities/Message"
import { Context, createPaginatedResponse } from "../types"

const PaginatedMessages = createPaginatedResponse(Message)
type PaginatedMessages = InstanceType<typeof PaginatedMessages>

@Resolver(Message)
export default class PostResolver {
  @Query(() => PaginatedMessages)
  @Authorized(["MEMBER"])
  async messages(
    @Arg("circleId", () => Int) circleId: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string
  ): Promise<PaginatedMessages> {
    const limit = 5
    const take = limit + 1
    const replacements: any[] = [circleId, take]
    if (cursor) {
      replacements.push(new Date(parseInt(cursor)))
    }

    const messages: any[] = await getConnection().query(
      ` SELECT m.*, u.username
      FROM message m INNER JOIN "user" u ON u.id = m."authorId"
      WHERE m."circleId" = $1 ${cursor ? `AND m."createdAt" < $3` : ""} 
      ORDER BY m."createdAt" DESC LIMIT $2
    `,
      replacements
    )

    const formattedMessages = messages.map((m) => ({
      ...m,
      author: {
        id: m.authorId,
        username: m.username,
      },
    }))
    return {
      data: formattedMessages.slice(0, limit),
      hasMore: formattedMessages.length === take,
    }
  }

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
