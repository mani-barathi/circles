import { Field, ID, Int, ObjectType } from "type-graphql"
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
  Index,
} from "typeorm"
import User from "./User"
import Invitation from "./Invitation"
import MemberRequest from "./MemberRequest"
import Member from "./Member"

@ObjectType()
@Entity()
export default class Circle extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Field(() => String)
  @Index({ fulltext: true })
  @Column({ type: "varchar", unique: true, length: 32 })
  name: string

  @Field(() => String)
  @Column()
  creatorId: number

  @Field(() => Int)
  @Column("int", { default: 1 })
  totalMembers: number

  // To check whether the current logged in user is a member of the circle
  @Field(() => Boolean)
  isMember: boolean

  // To check whether the current logged in user is admin of the circle
  @Field(() => Boolean)
  isAdmin: boolean

  @ManyToOne(() => User, (user) => user.circles)
  @JoinColumn({ name: "creatorId", referencedColumnName: "id" })
  @Field(() => User, { nullable: true })
  creator: User

  @OneToMany(() => Invitation, (invitation) => invitation.circle)
  @Field(() => [Invitation], { nullable: true })
  invitations: Invitation[]

  @OneToMany(() => MemberRequest, (memberRequest) => memberRequest.circle)
  @Field(() => [MemberRequest], { nullable: true })
  memberRequests: MemberRequest[]

  @OneToMany(() => Member, (member) => member.circle)
  @Field(() => [Member], { nullable: true })
  members: Member[]

  @Field(() => String)
  @Column({ type: "text" })
  description: string

  @Field(() => String)
  @CreateDateColumn()
  createdAt: string

  @Field(() => String, { nullable: true })
  @UpdateDateColumn()
  updatedAt: string
}
