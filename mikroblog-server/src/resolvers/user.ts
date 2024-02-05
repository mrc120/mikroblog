import {
  Resolver,
  Arg,
  Field,
  Mutation,
  Ctx,
  ObjectType,
  Query,
} from "type-graphql";
import { MyContext } from "../types";
import { User } from "../entities/User";
import argon2 from "argon2";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../constants";
import { UsernamePasswordInput } from "./UsernamePasswordInput";
import { validateRegister } from "../utils/validateRegister";
import { sendEmail } from "../utils/sendEmail";
import { v4 as uuidv4 } from 'uuid';
import { getConnection } from "typeorm"

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
    @Ctx() { redis, req }: MyContext
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

    const key = FORGET_PASSWORD_PREFIX + token;
    const userId = await redis.get(key);
    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "token przedawniony"
          }
        ]
      };
    }

    const userIdNum = parseInt(userId);
    const user = await User.findOneBy({ id: userIdNum });
    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "Nie znaleziono użytkownika"
          }
        ]
      }
    }

    await User.update(
      { id: userIdNum },
      {
        password: await argon2.hash(newPassword)
      });

    await redis.del(key);

    req.session.userId = user.id;
    return { user }

  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg('email') email: string,
    @Ctx() { redis }: MyContext
  ) {
    const user = await User.findOne({
      where: {
        email: email,

      }
    }); if (!user) {
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

    await sendEmail(email, `<a href="http://localhost:3000/change-password/${token}"
    >Change password</a>`)

    return true;
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext) {
    // you are not logged in
    // if (!req.session.userId) {
    //   console.log("id", req.session.userId)
    //   return null;
    // }
    console.log("id", req.session.userId)

    const user = await User.findOne({
      where: {
        id: req.session.userId
      }
    })
    return user;
  }


  //register
  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const errors = validateRegister(options);
    if (errors) {
      return { errors };
    }

    const hashedPassword = await argon2.hash(options.password);
    let user;
    try {
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          username: options.username,
          email: options.email,
          password: hashedPassword,
        })
        .returning("*")
        .execute();
      user = result.raw[0];
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
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne(
      usernameOrEmail.includes("@")
        ? { where: { email: usernameOrEmail } }
        : { where: { username: usernameOrEmail } }
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