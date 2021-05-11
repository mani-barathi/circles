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
} from "type-graphql"
import { createQueryBuilder, EntityNotFoundError, getManager } from "typeorm"
import { UNIQUE_CONSTRAINT_ERROR_CODE } from "../constants"
import Invitation from "../entities/Invitation"
import Member from "../entities/Member"
import User from "../entities/User"
import { isAuthorized } from "../middlewares/authMiddlewares"
import { Context, CustomError } from "../types"

@ObjectType()
class InvitationResponse {
  @Field(() => Invitation, { nullable: true })
  invitation?: Invitation

  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[]
}

@Resolver()
export default class InivitationResolver {
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
      .getMany()
    return invitations
  }

  @Query(() => [Invitation])
  @UseMiddleware(isAuthorized)
  async getSentInvitationOfCircle(
    @Arg("circleId", () => Int) circleId: number
  ): Promise<Invitation[]> {
    const invitations = await createQueryBuilder<Invitation>("invitation", "i")
      .select(["i.circleId", "i.senderId", "i.recipientId", "i.createdAt"])
      .innerJoin("i.recipient", "r")
      .addSelect(["r.id", "r.username"])
      .where("i.circleId = :circleId", { circleId })
      .orderBy("i.createdAt", "DESC")
      .getMany()
    return invitations
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuthorized)
  async acceptInvitation(
    @Arg("senderId", () => Int) senderId: number,
    @Arg("circleId", () => Int) circleId: number,
    @Ctx() { req }: Context
  ): Promise<Boolean> {
    try {
      await getManager().transaction(async (tm) => {
        const deleted = await tm.delete(Invitation, {
          circleId,
          senderId,
          recipientId: req.session.userId,
        })
        if (deleted.affected !== 1 || !deleted.affected) {
          throw new EntityNotFoundError(Invitation, {})
        }

        await tm.insert(Member, {
          circleId,
          userId: req.session.userId,
          isAdmin: false,
        })

        await tm.query(
          `update circle set "totalMembers" = "totalMembers" + 1, "updatedAt" = now() where id = $1`,
          [circleId]
        )
      }) // end of transaction
      return true
    } catch (e) {
      if (e.code === UNIQUE_CONSTRAINT_ERROR_CODE) {
        throw new Error("your are already a member of the circle")
      }
      if (e instanceof EntityNotFoundError) {
        throw new Error("no invitation found")
      }
      throw new Error("something went wrong")
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuthorized)
  async rejectInvitation(
    @Arg("senderId", () => Int) senderId: number,
    @Arg("circleId", () => Int) circleId: number,
    @Ctx() { req }: Context
  ): Promise<Boolean> {
    try {
      const deleted = await Invitation.delete({
        circleId,
        senderId,
        recipientId: req.session.userId,
      })
      if (deleted.affected !== 1 || !deleted.affected) {
        throw new Error(
          "Unable to reject.. either the invitation do not exist or you don't have permission"
        )
      }
      return true
    } catch (e) {
      throw e
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuthorized)
  async cancelInvitation(
    @Arg("recipientId", () => Int) recipientId: number,
    @Arg("circleId", () => Int) circleId: number,
    @Ctx() { req }: Context
  ): Promise<Boolean> {
    const deleted = await Invitation.delete({
      circleId,
      recipientId,
      senderId: req.session.userId,
    })
    if (deleted.affected !== 1 || !deleted.affected) {
      throw new Error(
        "Unable to cancel.. either the invitation do not exist or you don't have permission"
      )
    }
    return true
  }

  @Mutation(() => InvitationResponse)
  @UseMiddleware(isAuthorized)
  async sendInvitation(
    @Arg("recipiantName") recipiantName: string,
    @Arg("circleId", () => Int) circleId: number,
    @Ctx() { req }: Context
  ): Promise<InvitationResponse> {
    const { userId } = req.session
    try {
      await Member.findOneOrFail({
        where: { circleId, userId },
      })

      const recipient = await User.findOneOrFail({
        where: { username: recipiantName },
      })

      const isAlreadyMember = await getManager().query(
        `select exists(select 1 from member where "userId" = $1 and "circleId" = $2)`,
        [recipient.id, circleId]
      )
      if (isAlreadyMember[0].exists) {
        return {
          errors: [
            {
              path: "username",
              message: `user already is member of the circle`,
            },
          ],
        }
      }

      const invitation = await Invitation.insert({
        senderId: req.session.userId,
        recipientId: recipient.id,
        circleId,
        active: true,
      })

      return {
        invitation: {
          ...invitation.raw[0],
          senderId: userId,
          recipientId: recipient.id,
          circleId,
        },
      }
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        if (e.toString().includes("User")) {
          return {
            errors: [{ path: "username", message: `user not found` }],
          }
        }
        return {
          errors: [
            {
              path: "circle",
              message: `circle not found or you don't have permission`,
            },
          ],
        }
      }
      if (e.code === UNIQUE_CONSTRAINT_ERROR_CODE) {
        return {
          errors: [{ path: "unkown", message: "invitation already sent" }],
        }
      }
      return { errors: [{ path: "unkown", message: "something went wrong" }] }
    }
  }
}
