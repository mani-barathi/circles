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
export default class Invitation extends BaseEntity {
  @Field(() => Boolean)
  @Column({ default: true })
  active: Boolean;

  @Field(() => Int)
  @PrimaryColumn()
  circleId: number;

  @ManyToOne(() => Circle, (circle) => circle.invitations, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "circleId", referencedColumnName: "id" })
  @Field(() => Circle, { nullable: true })
  circle: Circle;

  @Field(() => Int)
  @PrimaryColumn()
  senderId: number;

  @ManyToOne(() => User, (user) => user.sentInvitations)
  @JoinColumn({ name: "senderId", referencedColumnName: "id" })
  @Field(() => User, { nullable: true })
  sender: User;

  @Field(() => Int)
  @PrimaryColumn()
  recipientId: number;

  @ManyToOne(() => User, (user) => user.receivedinvitations)
  @JoinColumn({ name: "recipientId", referencedColumnName: "id" })
  @Field(() => User, { nullable: true })
  recipient: User;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: string;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: string;
}
