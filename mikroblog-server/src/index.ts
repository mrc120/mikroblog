import "reflect-metadata";
import { COOKIE_NAME, __prod__ } from "./constants";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import Redis from "ioredis";
import connectRedis from "connect-redis";
import session from "express-session";
import cors from "cors";
import { Post } from "./entities/Post"
import { User } from "./entities/User"
import { createConnection } from "typeorm";

const main = async () => {

  const conn = await createConnection({
    type: 'postgres',
    database: 'mirkodb2',
    username: 'postgres',
    password: '123qwe',
    logging: true,
    synchronize: true,
    entities: [Post, User]
  })
  
  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis();
  app.use(
    cors({
      origin: ["*", "https://studio.apollographql.com"],
      credentials: true ,
    })
  );
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: "none", // csrf
        secure: true, // cookie only works in https
      },
      saveUninitialized: true,
      secret: "qowiueojwojfalksdjoqiwueo",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
      
    }), 
    context: ({ req, res }) => ({ req, res, redis }),
  });
  await apolloServer.start(); // Oczekaj na uruchomienie serwera Apollo

   apolloServer.applyMiddleware({
    app,
    cors: true,
  });
  app.set('trust proxy', process.env.NODE_ENV !== 'production')

  app.listen(4000, () => {
    console.log("Server started on localhost:4000");
  });
};

main().catch((err) => {
  console.error(err);
});