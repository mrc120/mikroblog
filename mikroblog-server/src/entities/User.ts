import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
@Entity()
export class User {
    
  @Field()
  @PrimaryKey()
  id!: number;

  @Field(() => String, { nullable: true })
  @Property({ type: "date" })
  createdAt: Date = new Date();

  @Field(() => String, { nullable: true })
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Field()
  @Property({ type: "username", unique: true })
  username!: string;

  @Field()
  @Property({ type: "email", unique: true })
  email!: string;


  @Property({type: "text"})
  password!: string;
}
