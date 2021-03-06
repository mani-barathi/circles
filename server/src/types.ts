import { Request, Response } from "express"
import { Session, SessionData } from "express-session"
import { PubSub } from "graphql-subscriptions"
import { ObjectType, Field, ClassType } from "type-graphql"
import { createUserLoader } from "./utils/dataloaders"

export type Context = {
  req: Request & {
    session: Session & Partial<SessionData> & { userId: number }
  }
  res: Response
  userLoader: ReturnType<typeof createUserLoader>
  pubsub: PubSub
  connection?: any | undefined
}

export interface PostInput {
  circleId: number
  creatorId: number
  text: string
  imageUrl?: string
  filename?: string
}

export const createPaginatedResponse = <TObj>(TClass: ClassType<TObj>) => {
  @ObjectType(`Paginated${TClass.name}`)
  class PaginatedResponse {
    @Field(() => [TClass])
    data: TObj[]

    @Field(() => Boolean)
    hasMore: Boolean
  }
  return PaginatedResponse
}

@ObjectType()
export class CustomError {
  @Field()
  path: string

  @Field()
  message: string
}
