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
} from "typeorm"
import Circle from "./Circle"
import Like from "./Like"
import User from "./User"

@ObjectType()
@Entity()
export default class Post extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string

  @Field(() => Int)
  @Column({ type: "int", default: 0 })
  likeCount: number

  // tells whether the logged in user has liked the post or not
  @Field(() => Boolean, { nullable: true })
  isLiked: Boolean

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

  @OneToMany(() => Like, (like) => like.post)
  likes: Like

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
