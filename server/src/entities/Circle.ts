import { Field, ID, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import User from "./User";

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

  @ManyToOne(() => User, (user) => user.circles)
  @JoinColumn({ name: "creatorId", referencedColumnName: "id" })
  @Field(() => User, { nullable: true })
  creator: User;

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
