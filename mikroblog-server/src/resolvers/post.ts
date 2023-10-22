import { RequiredEntityData } from "@mikro-orm/core";
// import { rejects } from "assert";
import { Resolver, Query, Ctx, Arg, Mutation } from "type-graphql";
import { Post } from "../entities/Post";
import { MyContext } from "../types";
import { sleep } from "../utils/sleep";

//get post
@Resolver()
export class PostResolver {
  @Query(() => [Post])
  async posts(@Ctx() { em }: MyContext): Promise<Post[]> {
    return em.find(Post, {});
  }


  // get post id 
  @Query(() => Post, { nullable: true })
  post(@Arg("id") id: number, @Ctx() { em }: MyContext): Promise<Post | null> {
    return em.findOne(Post, { id });
  }

  // create post
  @Mutation(() => Post)
  //uniq nazwa
  async createPost(
    @Arg("title") title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    const post = em.create(Post, {
      title,
    } as RequiredEntityData<Post>);
    await em.persistAndFlush(post);
    return post;
  }

  //udate post 
  @Mutation(() => Post)
  async updatePost(
    @Arg("id") id: number,
    @Arg("title", () => String, { nullable: true }) title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    const post = await em.findOne(Post, { id });
    if (!post) {
      return null;
    }
    if (typeof title != "undefined") {
      post.title = title;
      await em.persistAndFlush(post);
    }
    return post;
  }

  //delete post
  @Mutation(() => Boolean)
  async deletePost(
    @Arg("id") id: number,
    @Ctx() { em }: MyContext
  ): Promise<boolean> {
    await em.nativeDelete(Post, { id });
    return true;
  }
}

