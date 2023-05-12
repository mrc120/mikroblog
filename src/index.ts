import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
//import { Post } from "./entities/Post";
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import {createClient} from 'redis';
import connectRedis from "connect-redis";
import session from 'express-session';
import cors from "cors";

const main = async () => {
  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up;

  const app = express();


  const RediStore = connectRedis(session);
  const redisClient = createClient({ legacyMode: true });
  const redisStore = new RediStore({
    client: redisClient,
    disableTouch: true,
  })
  // console.log(process.env)
  redisClient.on('error', (err) => console.log('Redis Client Error', err));
  await redisClient.connect();



  app.use(cors({
    origin: ' ttps://studio.apollographql.com',
    credentials: true
  }));
  app.set('trust proxy', process.env.NODE_ENV !== 'production')

  app.use(
    session({
      name: "qid",
      store: redisStore,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10 years
        httpOnly: true,
        sameSite: 'lax',
        secure: true
      },
      secret: '31632623163262',
      resave: false,
      saveUninitialized: false,
    })
  )

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ em: orm.em, req, res })
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
