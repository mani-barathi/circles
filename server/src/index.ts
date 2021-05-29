import "reflect-metadata"
import dotenv from "dotenv"
import { ApolloServer } from "apollo-server-express"
import express from "express"
import http from "http"
import path from "path"
import cors from "cors"
import redis from "redis"
import connectRedis from "connect-redis"
import session from "express-session"
import { createConnection } from "typeorm"
import { buildSchema } from "type-graphql"
import { graphqlUploadExpress } from "graphql-upload"
import { RedisPubSub } from "graphql-redis-subscriptions"

import UserResolver from "./resolvers/user"
import CircleResolver from "./resolvers/circle"
import InvitationResolver from "./resolvers/invitation"
import MemberResolver from "./resolvers/member"
import MemberRequestResolver from "./resolvers/memberRequest"
import PostResolver from "./resolvers/post"
import LikeResolver from "./resolvers/like"
import MessageResolver from "./resolvers/message"

import { COOKIE_NAME } from "./constants"
import { customAuthChecker } from "./utils/authChecker"
import { createUserLoader } from "./utils/dataloaders"

dotenv.config()
const PORT = parseInt(process.env.PORT)
const PROD = process.env.ENV === "production"

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}

const redisPubSubOptions = {
  connection: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
  },
  retryStrategy: (times: number) => Math.min(times * 50, 2000),
}

const main = async () => {
  await createConnection({
    type: "postgres",
    url: process.env.DATABASE_URL,
    logging: true,
    synchronize: true,
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [path.join(__dirname, "./entities/*")],
  })

  const schema = await buildSchema({
    resolvers: [
      UserResolver,
      CircleResolver,
      InvitationResolver,
      MemberResolver,
      MemberRequestResolver,
      PostResolver,
      LikeResolver,
      MessageResolver,
    ],
    authChecker: customAuthChecker,
  })
  const RedisStore = connectRedis(session)
  const redisClient = redis.createClient({ url: process.env.REDIS_URL })

  const app: express.Application = express()
  const httpServer = http.createServer(app)

  const sessionMiddleware = session({
    name: COOKIE_NAME,
    store: new RedisStore({
      client: redisClient,
      disableTouch: true,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
      httpOnly: true,
      secure: PROD,
      path: "/",
      sameSite: "lax",
      domain: PROD ? process.env.PROD_API_URL : "localhost",
    },
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    resave: false,
  })

  app.use(cors(corsOptions))
  app.use(express.static("public"))
  app.use(sessionMiddleware)
  app.use(graphqlUploadExpress({ maxFileSize: 2500000, maxFiles: 1 }))
  // 2500000 : 2.5Mb

  const pubsub = new RedisPubSub(redisPubSubOptions)

  const apolloServer = new ApolloServer({
    schema,
    subscriptions: {
      path: "/subscriptions",
      onConnect: (_, ws: any) => {
        return new Promise((resolve) =>
          sessionMiddleware(ws.upgradeReq, {} as any, () => {
            resolve({ req: ws.upgradeReq })
          })
        )
      },
      onDisconnect: () => console.log("client Disconnect"),
    },
    context: ({ req, res, connection }) => ({
      req,
      res,
      userLoader: createUserLoader(),
      pubsub,
      connection,
    }),
    uploads: false,
  })

  apolloServer.applyMiddleware({ app, cors: false })
  apolloServer.installSubscriptionHandlers(httpServer)

  app.get("/", (_, res) => res.send("Circles API"))

  httpServer.listen(PORT, () =>
    console.log(`URL: http://localhost:${PORT}/graphql`)
  )
}

main()
