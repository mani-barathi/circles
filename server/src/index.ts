import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { createConnection } from "typeorm";
import { buildSchema } from "type-graphql";
// import User from "./entities/User"
import UserResolver from "./resolvers/userResolver";

const main = async () => {
  await createConnection();

  const schema = await buildSchema({
    resolvers: [UserResolver],
  });

  const app = express();
  const apolloServer = new ApolloServer({ schema });

  apolloServer.applyMiddleware({ app });

  app.get("/", (_, res) => res.send("Circles API"));
  app.listen(4000, () => console.log("URL: http://localhost:4000/graphql "));
};

main();
