import {
  Arg,
  Authorized,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql"
import { getConnection, getManager } from "typeorm"
import Post from "../entities/Post"
import User from "../entities/User"
import { isAuthorized } from "../middlewares/authMiddlewares"
import { Context, createPaginatedResponse } from "../types"

const PaginatedPosts = createPaginatedResponse(Post)
type PaginatedPosts = InstanceType<typeof PaginatedPosts>

@Resolver(Post)
export default class PostResolver {
  @FieldResolver(() => User)
  async creator(@Root() post: Post, @Ctx() { userLoader }: Context) {
    return userLoader.load(post.creatorId)
  }

  @Query(() => PaginatedPosts)
  @UseMiddleware(isAuthorized)
  async posts(
    @Arg("circleId", () => Int) circleId: Number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null,
    @Ctx() { req }: Context
  ): Promise<PaginatedPosts> {
    const { userId } = req.session
    const limit = 10
    const take = limit + 1
    const replacements: any[] = [circleId, take]
    if (cursor) {
      replacements.push(new Date(parseInt(cursor)))
    }

    const posts: any[] = await getConnection().query(
      ` SELECT p.*, 
(select exists (select 1 from "like" l where l."userId" = ${userId} and l."postId" = p.id)) "hasLiked"
      FROM post p WHERE p."circleId" = $1 ${
        cursor ? `AND p."createdAt" < $3` : ""
      } 
      ORDER BY p."createdAt" DESC LIMIT $2
    `,
      replacements
    )
    return {
      data: posts.slice(0, limit),
      hasMore: posts.length === take,
    }
  }

  @Query(() => PaginatedPosts)
  @UseMiddleware(isAuthorized)
  async myPosts(
    @Arg("circleId", () => Int) circleId: Number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null,
    @Ctx() { req }: Context
  ): Promise<PaginatedPosts> {
    const { userId } = req.session
    const limit = 10
    const take = limit + 1
    const replacements: any[] = [circleId, userId, take]
    if (cursor) {
      replacements.push(new Date(parseInt(cursor)))
    }

    const posts: any[] = await getConnection().query(
      ` SELECT p.*,
(select exists (select 1 from "like" l where l."userId" = $2 and l."postId" = p.id)) "hasLiked"
      FROM post p WHERE p."circleId" = $1 and "creatorId" =$2 
      ${cursor ? `AND p."createdAt" < $4` : ""} 
      ORDER BY p."createdAt" DESC LIMIT $3
    `,
      replacements
    )

    return {
      data: posts.slice(0, limit),
      hasMore: posts.length === take,
    }
  }

  @Mutation(() => Post)
  @Authorized(["MEMBER"])
  async createPost(
    @Arg("text", () => String) text: string,
    @Arg("circleId", () => Int) circleId: number,
    @Ctx() { req }: Context
  ): Promise<Post> {
    const { userId } = req.session

    if (text.length < 1 || text.length > 2000)
      throw new Error("text should be between 1 and 2000 characters")

    const post = await getManager().transaction(async (tm) => {
      const newPost = await tm
        .create(Post, {
          circleId,
          creatorId: userId,
          text,
        })
        .save()
      await tm.query(`update circle set "updatedAt" = now() where id = $1`, [
        circleId,
      ])
      return newPost
    })
    return post
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuthorized)
  async deletePost(
    @Arg("postId", () => Int) postId: number,
    @Ctx() { req }: Context
  ): Promise<Boolean> {
    const { userId } = req.session
    await Post.delete({ id: postId, creatorId: userId })
    return true
  }
}
