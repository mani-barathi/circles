import Circle from "../entities/Circle";
import { isAuthorized } from "../middlewares/authMiddlewares";
import { Context, CustomError } from "../types";
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { checkCircleInputValid } from "../utils/validations";
import { createQueryBuilder } from "typeorm";
import Member from "../entities/Member";

const UNIQUE_CONSTRAINT_ERROR_CODE = "23505";
const FOREIGN_KEY_CONSTRAINT_ERROR_CODE = "23503";

@ObjectType()
class CircleResponse {
  @Field(() => Circle, { nullable: true })
  circle?: Circle;

  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];
}

@Resolver(Circle)
export default class CircleResolver {
  @Query(() => [Circle])
  @UseMiddleware(isAuthorized)
  async getCircles(): Promise<Circle[]> {
    const circles = await createQueryBuilder<Circle>("circle", "c")
      .innerJoin("c.creator", "creator")
      .select(["c.id", "c.name", "c.description", "c.createdAt", "c.creatorId"])
      .addSelect(["creator.id", "creator.username"])
      .orderBy("c.createdAt", "DESC")
      // .where("c.createdAt < :cursor", {
      //   cursor: new Date(parseInt("1619793415482")),
      // })
      .getMany();
    return circles;
  }

  @Mutation(() => CircleResponse)
  @UseMiddleware(isAuthorized)
  async createCircle(
    @Arg("name") name: string,
    @Arg("description") description: string,
    @Ctx() { req }: Context
  ): Promise<CircleResponse> {
    try {
      const errors = checkCircleInputValid(name);
      if (errors.length > 0) {
        return { errors };
      }

      const circle = await Circle.create({
        name: name.toLowerCase(),
        description,
        creatorId: req.session.userId,
      }).save();

      await Member.create({
        circleId: circle.id,
        isAdmin: true,
        userId: req.session.userId,
      }).save();
      return { circle };
    } catch (e) {
      if (e.code === UNIQUE_CONSTRAINT_ERROR_CODE) {
        return { errors: [{ path: name, message: `name is taken` }] };
      }

      if (e.code === FOREIGN_KEY_CONSTRAINT_ERROR_CODE) {
        return { errors: [{ path: name, message: `invalid creator` }] };
      }
      return { errors: [{ path: "unkown", message: "something went wrong" }] };
    }
  }
}
