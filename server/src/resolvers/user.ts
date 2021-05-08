import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Field,
  Ctx,
  UseMiddleware,
  FieldResolver,
  ObjectType,
} from "type-graphql"
import { EntityNotFoundError, getManager } from "typeorm"
import argon2 from "argon2"
import User from "../entities/User"
import Circle from "../entities/Circle"
import { Context, CustomError } from "../types"
import { checkRegisterInputValid } from "../utils/validations"
import { isUnAuthorized } from "../middlewares/authMiddlewares"
import { COOKIE_NAME, UNIQUE_CONSTRAINT_ERROR_CODE } from "../constants"

@ObjectType()
class UserResponse {
  @Field(() => User, { nullable: true })
  user?: User

  @Field(() => [CustomError], { nullable: true })
  errors?: CustomError[]
}

@Resolver(User)
export default class UserResolver {
  @FieldResolver()
  async myCircles(@Ctx() { req }: Context): Promise<Circle[]> {
    const entityManager = getManager()
    const query: Circle[] = await entityManager.query(
      `
      SELECT c.* from circle as c INNER JOIN member as m on c.id = m."circleId" 
      WHERE m."userId" = $1 ORDER BY c."updatedAt" DESC;
    `,
      [req.session.userId]
    )
    return query
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: Context) {
    try {
      if (!req.session.userId) return null
      return await User.findOne(req.session.userId)
    } catch (e) {
      return null
    }
  }

  @Mutation(() => UserResponse)
  @UseMiddleware(isUnAuthorized)
  async register(
    @Arg("username") username: string,
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<UserResponse> {
    try {
      const errors = checkRegisterInputValid(username, email, password)
      if (errors.length > 0) {
        return { errors }
      }
      const hashedPassword = await argon2.hash(password)
      const user = await User.create({
        username: username.toLowerCase(),
        email,
        password: hashedPassword,
      }).save()
      return { user }
    } catch (e) {
      if (e.code === UNIQUE_CONSTRAINT_ERROR_CODE) {
        const field = e.detail.includes("email") ? "email" : "username"
        return { errors: [{ path: field, message: `${field} is taken` }] }
      }
      return { errors: [{ path: "unkown", message: "something went wrong" }] }
    }
  }

  @Mutation(() => UserResponse)
  @UseMiddleware(isUnAuthorized)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { req }: Context
  ): Promise<UserResponse> {
    try {
      const user = await User.findOneOrFail({ email })
      const isCorrect = await argon2.verify(user.password, password)
      if (!isCorrect) {
        return { errors: [{ path: "unkown", message: "invalid credentials" }] }
      }
      req.session.userId = user.id
      return { user }
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        return { errors: [{ path: "unkown", message: "no user found" }] }
      }
      return { errors: [{ path: "unkown", message: "something went wrong" }] }
    }
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: Context) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        if (err) {
          resolve(false)
        }
        res.clearCookie(COOKIE_NAME)
        resolve(true)
      })
    )
  }
}
