import { Field, ID, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from "typeorm";
import Circle from "./Circle";

@ObjectType()
@Entity()
export default class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column({ unique: true })
  username: string;

  @Field(() => String)
  @Column({ unique: true })
  email: string;

  @OneToMany(() => Circle, (circle) => circle.creator)
  circles: Circle[];

  @Column()
  password: string;
}
