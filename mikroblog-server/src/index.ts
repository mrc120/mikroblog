import { MikroORM } from "@mikro-orm/core";
import { COOKIE_NAME, __prod__ } from "./constants";
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import Redis from "ioredis";
import connectRedis from "connect-redis";
import session from "express-session";
import cors from "cors";
import { sendEmail } from "./utils/sendEmail"
const main = async () => {
   
  sendEmail("bob@bob.com", "hello")
  const orm = await MikroORM.init(microConfig);
  await orm.getMigrator().up;
  const app = express();
  
  
  
  const RediStore = connectRedis(session);        

  const redis = new Redis();

  // console.log(process.env)
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RediStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10 years
        httpOnly: true,
        path: "/graphql",
        sameSite: "none",
        secure: true,
      },
      secret: "31632623163262",
      resave: false,
      saveUninitialized: false,
    })
  );
  
  app.set("trust proxy", 1);
  app.use(
    cors({
      origin: '*',        
      credentials: true,
    })
  );

  // app.get("/", (req, res) => {
  //   res.send(req.session.userId);
  // });

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ em: orm.em, req, res, redis }),
  });

  async function startServer() {
    await apolloServer.start();
    apolloServer.applyMiddleware({
      app,
      cors: false,
    });
  }
  startServer();

  app.listen(4000, () => {
    console.log("Nasłuchiwanie: localhost:4000");
  });
};

main().catch((err) => {
  console.log(err);
});
