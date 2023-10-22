import { Redis } from 'ioredis';
import {
  Resolver,
  Arg,
  Field,
  Mutation,
  Ctx,
  ObjectType,
  Query,
} from "type-graphql";
import { EntityManager } from "@mikro-orm/postgresql";
import { MyContext } from "../types";
import { User } from "../entities/User";
import argon2 from "argon2";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../constants";
import { UsernamePasswordInput } from "./UsernamePasswordInput";
import { validateRegister } from "../utils/validateRegister";
import { sendEmail } from "../utils/sendEmail";
import { v4 as uuidv4 } from 'uuid';

declare module "express-session" {
  interface Session {
    userId: number;
  }
}

//Error
@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

//Dla erroru czy jest user czy err
@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg('token') token: string,
    @Arg('newPassword') newPassword: string,
    @Ctx() { em, redis, req }: MyContext
  ): Promise<UserResponse> {
    if (newPassword.length <= 3) {
      return {
        errors: [
          {
            field: "newPassword",
            message: "Hasło musi mieć więcej niz 3 znaki"
          }
        ],
      }
    }

    const userId = await redis.get(FORGET_PASSWORD_PREFIX + token)
    if (!userId) {
      return {
        errors: [
          {
            field: "token", 
            message: "token przedawniony" 
          }
        ]
      }
    }

    const user =  await em.findOne(User, { id: parseInt(userId)})
    if (!user){
      return {
        errors: [
          {
            field: "token",
            message: "Nie znaleziono użytkownika"
          }
        ]
      }
    }
    user.password = await argon2.hash(newPassword);

    await em.persistAndFlush(user)


    req.session.userId = user.id;
    return {user}

  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg('email') email: string,
    @Ctx() { em, redis }: MyContext
  ) {
    const user = await em.findOne(User, { email })
    if (!user) {
      //email not in db 
      return false
    }
    const token = uuidv4();
    console.log('token to: ', token)
    await redis.set(
      FORGET_PASSWORD_PREFIX + token,
      user.id,
      "EX",
      1000 * 60 * 60 * 24 * 3,
    );

    await sendEmail(email,
      `<a href="http://localhost:3000/change-password/${token}" >Change password</a>`)

    return true;
  }

  //me
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req, em }: MyContext) {
    if (!req.session.userId) {
      return null;
    }
    const user = await em.findOne(User, { id: req.session.userId });
    return user;
  }
  //register
  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const errors = validateRegister(options);
    if (errors) {
      return { errors };
    }

    const hashedPassword = await argon2.hash(options.password);
    let user;
    try {
      const result = await (em as EntityManager)
        .createQueryBuilder(User)
        .getKnexQuery()
        .insert({
          username: options.username,
          password: hashedPassword,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning("*");
      console.log(user = result[0]);
    } catch (err) {
      //|| err.detail.includes("already exists")) {
      // duplicate username error
      if (err.code === "23505") {
        return {
          errors: [
            {
              field: "username",
              message: "username already taken",
            },
          ],
        };
      }
    }
    req.session.userId = user.id;
    return { user };
  }

  //login
  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(
      User,
      usernameOrEmail.includes('@')
        ? { email: usernameOrEmail } :
        { username: usernameOrEmail }
    );
    if (!user) {
      return {
        errors: [
          {
            field: "usernameOrEmail",
            message: "Nie ma takiego użytkownika",
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "Nieprawidłowe hasło",
          },
        ],
      };
    }
    req.session.userId = user.id;
    return { user };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }

        resolve(true);
      })
    );
  }
}