import Member from "../entities/Member";
import { isAuthorized } from "../middlewares/authMiddlewares";
import { Arg, Field, Int, ObjectType, Query, UseMiddleware } from "type-graphql";
import { getConnection } from "typeorm";

@ObjectType()
class PaginatedMembers {
@Field(() => [Member])
members:Member[]

@Field(() => Boolean)
hasMore:Boolean
}

export default class MemberResolver {
  @Query(() => PaginatedMembers)
  @UseMiddleware(isAuthorized)
  async members(
    @Arg("circleId", () => Int) circleId: Number
    @Arg("cursor", () => String, {nullable:true}) cursor: string | null
  ): Promise<PaginatedMembers> {
    const limit = 10
    const take = limit + 1
    const replacements:any[] = [circleId,take]
    if(cursor){
      replacements.push(new Date((parseInt(cursor)+1)))
    }
    const members:any[] = await getConnection().query(
    ` SELECT m.*, u.username FROM member m INNER JOIN "user" u ON u.id=m."userId" 
      WHERE m."circleId" = $1  
      ${cursor ? `AND m."createdAt" > $3` : ""} 
      ORDER BY m."createdAt" LIMIT $2
    `
    ,replacements)

    const formatedMembers:Member[] = members.map((m) => ({
        ...m,
        user:{
            id:m.userId,
            username:m.username
        }
    }))
    return {
        members : formatedMembers.slice(0,limit),
        hasMore: (formatedMembers.length === take)
    }
  }
}

    // const membersQuery = await createQueryBuilder<Member>("member", "m")
    //       .select(["m.isAdmin", "m.circleId", "m.userId", "m.createdAt"])
    //       .innerJoin("m.user", "u")
    //       .addSelect(["u.id", "u.username"])
    //       .where("m.circleId = :circleId", { circleId })
    // if(cursor){
    //     membersQuery.andWhere('m.createdAt > :cursor',{cursor: new Date((parseInt(cursor)+1))})
    // }
    // const members = await membersQuery.take(take).getMany()