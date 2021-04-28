import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { createConnection } from "typeorm";
import { buildSchema } from "type-graphql";
// import User from "./entities/User"
import UserResolver from "./resolvers/userResolver";
import redis from "redis";
import connectRedis from "connect-redis";
import session from "express-session";

const main = async () => {
  await createConnection();

  const schema = await buildSchema({
    resolvers: [UserResolver],
  });

  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  app.use(
    session({
      name: "qwe",
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
  );

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res }),
  });

  apolloServer.applyMiddleware({ app });

  app.get("/", (_, res) => res.send("Circles API"));
  app.listen(4000, () => console.log("URL: http://localhost:4000/graphql "));
};

main();
