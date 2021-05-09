import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql"
import { createQueryBuilder, EntityNotFoundError, getManager } from "typeorm"
import { checkCircleInputValid } from "../utils/validations"
import {
  FOREIGN_KEY_CONSTRAINT_ERROR_CODE,
  UNIQUE_CONSTRAINT_ERROR_CODE,
} from "../constants"
import Member from "../entities/Member"
import Circle from "../entities/Circle"
import Invitation from "../entities/Invitation"
import { isAuthorized } from "../middlewares/authMiddlewares"
import { Context, createPaginatedResponse, CustomError } from "../types"

@ObjectType()
class CircleResponse {
  @Field(() => Circle, { nullable: true })
  circle?: Circle

  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[]
}

const PaginatedCircles = createPaginatedResponse(Circle)
type PaginatedCircles = InstanceType<typeof PaginatedCircles>

@Resolver(Circle)
export default class CircleResolver {
  @FieldResolver()
  isAdmin(@Root() circle: Circle, @Ctx() { req }: Context): Boolean {
    return req.session.userId === circle.creatorId
  }

  @FieldResolver()
  async isMember(
    @Root() circle: Circle,
    @Ctx() { req }: Context
  ): Promise<Boolean> {
    if (!req.session.userId) return false
    const member = await getManager().query(
      `select exists(select 1 from member where "userId" = $1 and "circleId" = $2)`,
      [req.session.userId, circle.id]
    )
    return member[0].exists
  }

  @FieldResolver()
  async members(@Root() circle: Circle): Promise<Member[]> {
    const members = await createQueryBuilder<Member>("member", "m")
      .select(["m.isAdmin", "m.userId", "m.createdAt"])
      .innerJoin("m.user", "u")
      .addSelect(["u.id", "u.username"])
      .where("m.circleId = :circleId", { circleId: circle.id })
      .orderBy("m.createdAt", "ASC")
      .getMany()
    return members
  }

  @FieldResolver()
  async invitations(@Root() circle: Circle): Promise<Invitation[]> {
    const invitations = await createQueryBuilder<Invitation>("invitation", "i")
      .select(["i.circleId", "i.senderId", "i.recipientId", "i.createdAt"])
      .innerJoin("i.recipient", "r")
      .addSelect(["r.id", "r.username"])
      .where("i.circleId = :circleId", { circleId: circle.id })
      .orderBy("i.createdAt", "DESC")
      .getMany()
    return invitations
  }

  @Query(() => [Circle])
  async getCircles(): Promise<Circle[]> {
    const circles = await createQueryBuilder<Circle>("circle", "c")
      .innerJoin("c.creator", "creator")
      .select([
        "c.id",
        "c.name",
        "c.description",
        "c.createdAt",
        "c.creatorId",
        "c.totalMembers",
      ])
      .addSelect(["creator.id", "creator.username"])
      .orderBy("c.updatedAt", "DESC")
      .getMany()
    return circles
  }

  @Query(() => PaginatedCircles)
  async searchCircle(
    @Arg("query", () => String) query: string,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedCircles> {
    try {
      const limit = 2
      const limitPlusOne = limit + 1
      const qb = createQueryBuilder<Circle>("circle", "c")
        .innerJoin("c.creator", "u")
        .select([
          "c.id",
          "c.name",
          "c.createdAt",
          "c.updatedAt",
          "c.creatorId",
          "c.totalMembers",
        ])
        .addSelect(["u.id", "u.username"])
        .where(`c.name like :term`, { term: `%${query}%` })

      if (cursor) {
        console.log("########added cursor######")
        qb.andWhere(`c.updatedAt < :cursor`, {
          cursor: new Date(parseInt(cursor)),
        })
      }
      qb.orderBy("c.totalMembers", "DESC")
      qb.addOrderBy("c.updatedAt", "DESC")
      const data = await qb.take(limitPlusOne).getMany()

      return {
        data: data.slice(0, limit),
        hasMore: data.length === limitPlusOne,
      }
    } catch (e) {
      console.log(e)
      throw new Error("Something went wrong")
    }
  }

  @Query(() => Circle)
  async circle(@Arg("circleId", () => Int) circleId: number): Promise<Circle> {
    try {
      const circle = await createQueryBuilder<Circle>("circle", "c")
        .innerJoin("c.creator", "creator")
        .select([
          "c.id",
          "c.name",
          "c.description",
          "c.createdAt",
          "c.creatorId",
          "c.totalMembers",
        ])
        .addSelect(["creator.id", "creator.username"])
        .where("c.id = :circleId", { circleId })
        .getOneOrFail()
      return circle
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new Error("No Circle Found!")
      }
      throw new Error("Something went wrong")
    }
  }

  @Mutation(() => CircleResponse)
  @UseMiddleware(isAuthorized)
  async createCircle(
    @Arg("name") name: string,
    @Arg("description") description: string,
    @Ctx() { req }: Context
  ): Promise<CircleResponse> {
    try {
      const errors = checkCircleInputValid(name)
      if (errors.length > 0) {
        return { errors }
      }

      const circle = await Circle.create({
        name: name.toLowerCase(),
        description,
        creatorId: req.session.userId,
        // totalMembers:1
      }).save()

      await Member.create({
        circleId: circle.id,
        isAdmin: true,
        userId: req.session.userId,
      }).save()
      return { circle }
    } catch (e) {
      if (e.code === UNIQUE_CONSTRAINT_ERROR_CODE) {
        return { errors: [{ path: name, message: `name is taken` }] }
      }

      if (e.code === FOREIGN_KEY_CONSTRAINT_ERROR_CODE) {
        return { errors: [{ path: name, message: `invalid creator` }] }
      }
      return { errors: [{ path: "unkown", message: "something went wrong" }] }
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuthorized)
  async exitCircle(
    @Arg("circleId", () => Int) circleId: number,
    @Ctx() { req }: Context
  ): Promise<Boolean> {
    const { userId } = req.session
    try {
      const deleted = await Member.delete({ userId, circleId })

      if (deleted.affected !== 1 || !deleted.affected) {
        return true
      }

      await getManager().query(
        `update circle set "totalMembers" = "totalMembers" - 1 where id = $1`,
        [circleId]
      )
      return true
    } catch (e) {
      throw new Error("something went wrong!")
    }
  }
}
