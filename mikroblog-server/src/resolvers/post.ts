// import { rejects } from "assert";
import { Resolver, Query, Ctx, Arg, Mutation, Field, InputType, UseMiddleware } from "type-graphql";
import { Post } from "../entities/Post";
import { MyContext } from "src/types";
// import { isAuth } from "src/middleware/isAuth";


@InputType()
class PostInput {
  @Field()
  title: string;
  @Field()
  text: string;
}
//get post
@Resolver()
export class PostResolver {
  @Query(() => [Post])
  async posts(): Promise<Post[]> {
    return Post.find();
  }


  // get post id 
  @Query(() => Post, { nullable: true })
  post(@Arg("id") id: number): Promise<Post | null> {
    return Post.findOne({ where: { id } });
  }


  // create post
  @Mutation(() => Post)
  //uniq nazwa
  async createPost(
    @Arg("input") input: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    //   if(!req.session.userId){
    //   throw new Error("Brak identyfikacji")
    // }
    console.log("id: ", req.session.userId)
    return Post.create({
      ...input,
      creatorId: req.session.userId
    }).save()
  }

  //udate post 
  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id") id: number,
    @Arg("title", () => String, { nullable: true }) title: string,
  ): Promise<Post | null> {
    const post = await Post.findOne({
      where: { id }
    });
    if (!post) {
      return null;
    }
    if (typeof title != "undefined") {
      await Post.update({ id }, { title })
    }
    return post;
  }

  //delete post
  @Mutation(() => Boolean)
  async deletePost(
    @Arg("id") id: number): Promise<boolean> {
    await Post.delete(id);
    return true;
  }
}
