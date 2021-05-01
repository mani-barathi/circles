import { Field, Int, ObjectType } from "type-graphql";
import {
  Entity,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import Circle from "./Circle";
import User from "./User";

@ObjectType()
@Entity()
export default class Member extends BaseEntity {
  @Field(() => Int)
  @PrimaryColumn({ unique: true })
  userId: number;

  @ManyToOne(() => User, (user) => user.members, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId", referencedColumnName: "id" })
  @Field(() => User, { nullable: true })
  user: User;

  @Field(() => Int)
  @PrimaryColumn()
  circleId: number;

  @ManyToOne(() => Circle, (circle) => circle.members, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "circleId", referencedColumnName: "id" })
  @Field(() => Circle, { nullable: true })
  circle: Circle;

  @Field(() => Boolean)
  @Column({ default: false })
  isAdmin: Boolean;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: string;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: string;
}
