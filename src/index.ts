import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import microConfig from "./mikro-orm.config";

const main = async () => {
  //log
  // console.log("dirname: ", __dirname);

  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up();
  const post = orm.em.create(Post, {
    title: "John Snow",
    createdAt: "",
    updatedAt: "",
    id: 1,
  });
  await orm.em.persistAndFlush(post);
};
main().catch((err) => {
  console.log(err);
});
