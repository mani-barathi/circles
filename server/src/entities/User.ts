import { Field, ID, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from "typeorm";
import Circle from "./Circle";
import Invitation from "./Invitation";
import Member from "./Member";

@ObjectType()
@Entity()
export default class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column({ unique: true })
  username: string;

  @Field(() => String, { nullable: true })
  @Column({ unique: true })
  email?: string;

  @Field(() => [Circle])
  myCircles: Circle[];

  @OneToMany(() => Circle, (circle) => circle.creator)
  circles: Circle[];

  @OneToMany(() => Invitation, (invitation) => invitation.sender)
  sentInvitations: Invitation[];

  @OneToMany(() => Invitation, (invitation) => invitation.recipient)
  receivedinvitations: Invitation[];

  @OneToMany(() => Member, (member) => member.user)
  members: Member[];

  @Column()
  password: string;
}
