import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import microConfig from "./mikro-orm.config";
import express from "express"

const main = async () => {
  //log

  // console.log("test")
  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up();
  // const app = express();
  // app.get('/', (_, res) => {
  //   res.send("hello")
  // })
  // app.listen(4000, () => {
  //   console.log("Nasłuchiwanie: localhost:4000")
  // })
  const post = orm.em.create(Post, {
    title: "John Snow",
    createdAt: "02-02-2022",
    updatedAt: "02-02-2022",
    id: 21

  });
  await orm.em.persistAndFlush(post);
  console.log("-----sql2-----")
  orm.em.persist(post)
  const posts = await orm.em.find(Post, {});
  console.log(posts)

  await orm.em.nativeInsert(Post, {title: "pierwszy post"})
};
main().catch((err) => {
  console.log(err);
});
