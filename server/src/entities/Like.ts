import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm"
import Circle from "./Circle"
import Post from "./Post"
import User from "./User"

@Entity()
class Like extends BaseEntity {
  @PrimaryColumn()
  postId: number

  @ManyToOne(() => Post, (post) => post.likes, { onDelete: "CASCADE" })
  @JoinColumn({ name: "postId", referencedColumnName: "id" })
  post: Post

  @PrimaryColumn()
  userId: number

  @ManyToOne(() => User, (user) => user.likes, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId", referencedColumnName: "id" })
  user: User

  @PrimaryColumn()
  circleId: number

  @ManyToOne(() => Circle, (circle) => circle.likes, { onDelete: "CASCADE" })
  @JoinColumn({ name: "circleId", referencedColumnName: "id" })
  circle: Circle

  @CreateDateColumn()
  createdAt: string
}

export default Like
