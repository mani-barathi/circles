import { Field, Int, ObjectType } from "type-graphql"
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm"
import Circle from "./Circle"
import User from "./User"

@ObjectType()
@Entity()
export default class Message extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Field(() => Int)
  @Column()
  authorId: number

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.messages, { onDelete: "CASCADE" })
  @JoinColumn({ name: "authorId", referencedColumnName: "id" })
  author: User

  @Field(() => Int)
  @Column()
  circleId: number

  @Field(() => Circle, { nullable: true })
  @ManyToOne(() => Circle, (circle) => circle.messages, { onDelete: "CASCADE" })
  @JoinColumn({ name: "circleId", referencedColumnName: "id" })
  circle: Circle

  @Field(() => String)
  @Column({ type: "text" })
  text: string

  @Field(() => String)
  @CreateDateColumn()
  createdAt: string
}
