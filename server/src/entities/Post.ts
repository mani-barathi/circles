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
} from "typeorm"
import Circle from "./Circle"
import User from "./User"

@ObjectType()
@Entity()
export default class Post extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Field(() => Int)
  @Column()
  creatorId: number

  @ManyToOne(() => User, (user) => user.posts, { onDelete: "CASCADE" })
  @JoinColumn({ name: "creatorId", referencedColumnName: "id" })
  @Field(() => User, { nullable: true })
  creator: User

  @Field(() => Int)
  @Column()
  circleId: number

  @ManyToOne(() => Circle, (circle) => circle.posts, { onDelete: "CASCADE" })
  @JoinColumn({ name: "circleId", referencedColumnName: "id" })
  @Field(() => Circle, { nullable: true })
  circle: Circle

  @Field(() => String)
  @Column({ type: "text" })
  text: string

  @Field(() => String)
  @CreateDateColumn()
  createdAt: string

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: string
}
