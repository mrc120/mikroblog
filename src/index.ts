import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
//import { Post } from "./entities/Post";
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { PostResolver } from "./resolvers/post";

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up;

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver],
      validate: false,
    }),
    context: () => ({ em: orm.em })
  });
  
  async function startServer() {
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });
  }
  startServer();

  app.listen(4000, () => {
    console.log("Nasłuchiwanie: localhost:4000");
  });
};

main().catch((err) => {
  console.log(err);
});
//   const post = orm.em.create(Post, {
//     title: "John Snow",
//     createdAt: "02-02-2022",
//     updatedAt: "02-02-2022",
//   });
//   await orm.em.persistAndFlush(post);
//   console.log("-----sql2-----");
//   orm.em.persist(post);
//   const posts = await orm.em.find(Post, {});
//   console.log(posts);

//   await orm.em.nativeInsert(Post, { title: "pierwszy post" });
