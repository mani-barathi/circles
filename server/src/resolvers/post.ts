import {
  Arg,
  Authorized,
  Ctx,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql"
import { getConnection, getManager } from "typeorm"
import Post from "../entities/Post"
import { isAuthorized } from "../middlewares/authMiddlewares"
import { Context, createPaginatedResponse } from "../types"

const PaginatedPosts = createPaginatedResponse(Post)
type PaginatedPosts = InstanceType<typeof PaginatedPosts>

@Resolver()
export default class PostResolver {
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
    // : 'null as "voteStatus"
    const posts: any[] = await getConnection().query(
      ` SELECT p.*, u.username , 
(select exists (select 1 from "like" l where l."userId" = ${userId} and l."postId" = p.id)) "hasLiked"
      FROM post p INNER JOIN "user" u ON u.id = p."creatorId" 
      WHERE p."circleId" = $1 ${cursor ? `AND p."createdAt" < $3` : ""} 
      ORDER BY p."createdAt" DESC LIMIT $2
    `,
      replacements
    )

    const formatedPosts: Post[] = posts.map((post) => ({
      ...post,
      creator: {
        id: post.creatorId,
        username: post.username,
      },
    }))
    return {
      data: formatedPosts.slice(0, limit),
      hasMore: formatedPosts.length === take,
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
}