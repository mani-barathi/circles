import { ObjectType, Field } from "type-graphql";

@ObjectType()
export default class User {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  age: number;

  constructor(name: string, age: number = 20) {
    this.name = name;
    this.age = age;
  }
}
