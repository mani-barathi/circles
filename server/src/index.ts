import "reflect-metadata"
import { ApolloServer } from "apollo-server-express"
import express from "express"
import cors from "cors"
import redis from "redis"
import connectRedis from "connect-redis"
import session from "express-session"
import { createConnection } from "typeorm"
import { buildSchema } from "type-graphql"

import UserResolver from "./resolvers/user"
import CircleResolver from "./resolvers/circle"
import InvitationResolver from "./resolvers/invitation"
import MemberResolver from "./resolvers/member"
import MemberRequestResolver from "./resolvers/MemberRequest"
import PostResolver from "./resolvers/post"
import LikeResolver from "./resolvers/like"

import { COOKIE_NAME } from "./constants"
import { customAuthChecker } from "./utils/authChecker"
import { createUserLoader } from "./utils/dataloaders"

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
}

const main = async () => {
  await createConnection()

  const schema = await buildSchema({
    resolvers: [
      UserResolver,
      CircleResolver,
      InvitationResolver,
      MemberResolver,
      MemberRequestResolver,
      PostResolver,
      LikeResolver,
    ],
    authChecker: customAuthChecker,
  })
  const RedisStore = connectRedis(session)
  const redisClient = redis.createClient()

  const app = express()
  app.use(cors(corsOptions))

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      },
      saveUninitialized: false,
      secret: "aksdfmioy234-asdfn-23fs-234",
      resave: false,
    })
  )

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res, userLoader: createUserLoader() }),
  })

  apolloServer.applyMiddleware({ app, cors: false })

  app.get("/", (_, res) => res.send("Circles API"))
  app.listen(4000, () => console.log("URL: http://localhost:4000/graphql "))
}

main()
