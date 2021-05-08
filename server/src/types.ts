import { Request, Response } from "express"
import { Session, SessionData } from "express-session"
import { ObjectType, Field, ClassType } from "type-graphql"

export type Context = {
  req: Request & {
    session: Session & Partial<SessionData> & { userId: number }
  }
  res: Response
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
