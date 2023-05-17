import {
  Resolver,
  Arg,
  InputType,
  Field,
  Mutation,
  Ctx,
  ObjectType,
  Query
} from "type-graphql";
import { RequiredEntityData } from "@mikro-orm/core";
import { MyContext } from "../Types";
import { User } from "../entities/User";
import argon2 from "argon2";

@InputType()
export class UsernamePasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

declare module 'express-session' {
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
  @Query(() => User, { nullable: true })
  async me(
    @Ctx() { req, em }: MyContext) {
      console.log("Session: ", req.session)
    if (!req.session.userId) {
      return null;
    }
    const user = await em.findOne(User, { id: req.session.userId });
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    if (options.username.length <= 2) {
      return {
        errors: [
          {
            field: "username",
            message: "Musi mieć więcej niż 2 znaki",
          },
        ],
      };
    }
    if (options.password.length <= 3) {
      return {
        errors: [
          {
            field: "password",
            message: "Musi mieć więcej niż 3 znaki",
          },
        ],
      };
    }
    const hashedPassword = await argon2.hash(options.password);
    const user = em.create(User, {
      username: options.username,
      password: hashedPassword,
    } as RequiredEntityData<User>);
    try {
      await em.persistAndFlush(user);
    } catch (err) {
      console.log("message", err.message);
    }

    req.session.userId = user.id;
    console.log(req.session.userId + " ->> userId reg")
    console.log(user.id + "<-- ID")
    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: options.username });
    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "Nie ma takiego użytkownika",
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password, options.password);
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
    console.log(req.session.userId + "<-- session id")
    return { user };
  }
}