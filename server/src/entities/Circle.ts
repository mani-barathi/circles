import { Field, ID, Int, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import User from "./User";
import Invitation from "./Invitation";
import Member from "./Member";

@ObjectType()
@Entity()
export default class Circle extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column({ unique: true })
  name: string;

  @Field(() => String)
  @Column()
  creatorId: number;

  @Field(() => Int)
  @Column("int", { default: 1 })
  totalMembers: number;

  // To check whether the current logged in user is a member of the circle
  @Field(() => Boolean)
  isMember: boolean;

  // To check whether the current logged in user is admin of the circle
  @Field(() => Boolean)
  isAdmin: boolean;

  @ManyToOne(() => User, (user) => user.circles)
  @JoinColumn({ name: "creatorId", referencedColumnName: "id" })
  @Field(() => User, { nullable: true })
  creator: User;

  @OneToMany(() => Invitation, (invitation) => invitation.circle)
  @Field(() => User, { nullable: true })
  invitations: User;

  @OneToMany(() => Member, (member) => member.circle)
  @Field(() => User, { nullable: true })
  members: User;

  @Field(() => String)
  @Column()
  description: string;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: string;

  @Field(() => String, { nullable: true })
  @UpdateDateColumn()
  updatedAt: string;
}
