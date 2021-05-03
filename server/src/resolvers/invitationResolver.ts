import Circle from "../entities/Circle";
import Member from "../entities/Member";
import User from "../entities/User";
import Invitation from "../entities/Invitation";
import { isAuthorized } from "../middlewares/authMiddlewares";
import { Context, CustomError } from "../types";
import {
  Arg,
  Ctx,
  Field,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { createQueryBuilder, EntityNotFoundError, getManager } from "typeorm";

const UNIQUE_CONSTRAINT_ERROR_CODE = "23505";

@ObjectType()
class InvitationResponse {
  @Field(() => Invitation, { nullable: true })
  invitation?: Invitation;

  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[];
}

@Resolver()
export default class CircleResolver {
  @Query(() => [Invitation])
  @UseMiddleware(isAuthorized)
  async getIntivations(@Ctx() { req }: Context): Promise<Invitation[]> {
    const invitations = await createQueryBuilder<Invitation>("invitation", "i")
      .select(["i.active", "i.createdAt"])
      .innerJoin("i.sender", "s")
      .addSelect(["s.id", "s.username"])
      .innerJoin("i.recipient", "r")
      .addSelect(["r.id", "r.username"])
      .innerJoin("i.circle", "c")
      .addSelect(["c.id", "c.name"])
      .orderBy("i.createdAt", "DESC")
      .where("i.recipientId =:id", { id: req.session.userId })
      .andWhere("i.active = true")
      .getMany();
    return invitations;
  }

  @Mutation(() => Circle)
  @UseMiddleware(isAuthorized)
  async acceptInvitation(
    @Arg("senderId", () => Int) senderId: number,
    @Arg("circleId", () => Int) circleId: number,
    @Ctx() { req }: Context
  ): Promise<Circle> {
    try {
      const deleted = await Invitation.delete({
        circleId,
        senderId,
        recipientId: req.session.userId,
      });
      if (deleted.affected !== 1 || !deleted.affected) {
        throw new EntityNotFoundError(Invitation, {});
      }

      await Member.insert({
        circleId,
        userId: req.session.userId,
        isAdmin: false,
      });

      const circle = await getManager().query(
        `update circle set "totalMembers" = "totalMembers" + 1 where id = $1 returning id,name`,
        [circleId]
      );
      return circle[0][0];
    } catch (e) {
      if (e.code === UNIQUE_CONSTRAINT_ERROR_CODE) {
        throw new Error("your are already a member of the circle");
      }
      if (e instanceof EntityNotFoundError) {
        throw new Error("no invitation found");
      }
      throw new Error("something went wrong");
    }
  }

  @Mutation(() => InvitationResponse)
  @UseMiddleware(isAuthorized)
  async sendInvitation(
    @Arg("recipiantName") recipiantName: string,
    @Arg("circleId", () => Int) circleId: number,
    @Ctx() { req }: Context
  ): Promise<InvitationResponse> {
    try {
      const recipientPromise = User.findOneOrFail({
        where: { username: recipiantName },
      });
      const circlePromise = Circle.findOneOrFail({
        where: { id: circleId, creatorId: req.session.userId },
      });
      const [recipient, circle] = await Promise.all([
        recipientPromise,
        circlePromise,
      ]);

      const invitation = await Invitation.create({
        senderId: req.session.userId,
        recipientId: recipient.id,
        circleId: circle.id,
        active: true,
      }).save();

      return { invitation };
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        if (e.toString().includes("User")) {
          return {
            errors: [{ path: "username", message: `recipient not found` }],
          };
        }
        return {
          errors: [
            {
              path: "circle",
              message: `circle not found or you don't have permission`,
            },
          ],
        };
      }
      return { errors: [{ path: "unkown", message: "something went wrong" }] };
    }
  }
}
