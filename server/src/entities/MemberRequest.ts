import { Field, Int, ObjectType } from "type-graphql";
import {
  Entity,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from "typeorm";
import Circle from "./Circle";
import User from "./User";

@ObjectType()
@Entity()
export default class MemberRequest extends BaseEntity {
  @Field(() => Boolean)
  @Column({ default: true })
  active: Boolean;

  @Field(() => Int, { nullable: true })
  @PrimaryColumn()
  circleId: number;

  @ManyToOne(() => Circle, (circle) => circle.memberRequests, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "circleId", referencedColumnName: "id" })
  @Field(() => Circle)
  circle: Circle;

  @Field(() => Int, { nullable: true })
  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => User, (user) => user.memberRequests, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId", referencedColumnName: "id" })
  @Field(() => User)
  user: User;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: string;

  @Field(() => String, { nullable: true })
  @UpdateDateColumn()
  updatedAt: string;
}
