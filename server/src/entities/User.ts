import { Field, Int, ObjectType } from "type-graphql"
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm"
import Circle from "./Circle"
import Invitation from "./Invitation"
import Like from "./Like"
import Member from "./Member"
import MemberRequest from "./MemberRequest"
import Post from "./Post"
import Message from "./Message"

@ObjectType()
@Entity()
export default class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number

  @Field(() => String)
  @Column({ length: 16, unique: true })
  username: string

  @Field(() => String, { nullable: true })
  @Column({ type: "varchar", unique: true })
  email?: string

  @Column()
  password: string

  // includes all the circles where the user is either a creator or a member
  @Field(() => [Circle])
  myCircles: Circle[]

  @OneToMany(() => Circle, (circle) => circle.creator)
  circles: Circle[]

  @OneToMany(() => Post, (post) => post.creator)
  posts: Post[]

  @OneToMany(() => Invitation, (invitation) => invitation.sender)
  sentInvitations: Invitation[]

  @OneToMany(() => MemberRequest, (memberRequest) => memberRequest.user)
  memberRequests: MemberRequest[]

  @OneToMany(() => Invitation, (invitation) => invitation.recipient)
  receivedinvitations: Invitation[]

  @OneToMany(() => Member, (member) => member.user)
  members: Member[]

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[]

  @OneToMany(() => Message, (message) => message.author)
  messages: Message[]
}
