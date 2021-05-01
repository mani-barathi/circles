import Circle from "../entities/Circle";
import User from "../entities/User";
import Invitation from "../entities/Invitation";
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
import { createQueryBuilder, EntityNotFoundError } from "typeorm";

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

  @Mutation(() => InvitationResponse)
  @UseMiddleware(isAuthorized)
  async sendInvitation(
    @Arg("recipiantName") recipiantName: string,
    @Arg("circleId") circleId: number,
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
