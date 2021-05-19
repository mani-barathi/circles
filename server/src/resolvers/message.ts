import { withFilter } from "graphql-subscriptions"
import {
  Arg,
  Authorized,
  Ctx,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  Subscription,
} from "type-graphql"
import { getConnection } from "typeorm"
import Message from "../entities/Message"
import { Context, createPaginatedResponse } from "../types"

const PaginatedMessages = createPaginatedResponse(Message)
type PaginatedMessages = InstanceType<typeof PaginatedMessages>
const NEW_MESSAGE = "NEW_MESSAGE"

@Resolver(Message)
export default class MessageResolver {
  @Subscription({
    subscribe: withFilter(
      (_, args, { connection, pubsub }: Context, ___) => {
        console.log("args:", args)
        const userId = connection.context.req.session || null
        if (!userId) throw new Error("not authenticated !")
        // const [result] = await getManager().query(
        //   `
        // select exists (select 1 from member where "userId" = $1 and "circleId" = $2 )
        // `,
        //   [userId, args.circleId]
        // )
        // if (!result.exists) throw new Error("Not authorized !")
        return pubsub.asyncIterator(NEW_MESSAGE)
      },
      (payload, variables) => {
        return variables.circleId === payload.circleId
      }
    ), // end of withFilter
  })
  newMessage(
    @Root() message: Message,
    // @ts-ignore
    @Arg("circleId", () => Int) circleId: number
  ): Message {
    console.log(`new message by ${message.author.username}`)
    return message
  }

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
    @Arg("username", () => String) username: string,
    @Ctx() { pubsub, req }: Context
  ): Promise<Boolean> {
    const { userId } = req.session
    if (text.length === 0 || username.length < 3) return false

    const message = await Message.create({
      authorId: userId,
      circleId,
      text,
    }).save()
    const payloadMessage = {
      ...message,
      author: {
        id: userId,
        username,
      },
    }
    pubsub.publish(NEW_MESSAGE, payloadMessage)
    return true
  }
}
