import React from "react"
import { Post, useMeQuery } from "../generated/graphql"
import LikeButton from "./LikeButton"

interface MyPostProps {
  post: Pick<
    Post,
    "id" | "text" | "createdAt" | "circleId" | "hasLiked" | "likesCount"
  >
}

const MyPost: React.FC<MyPostProps> = ({ post }) => {
  const { data } = useMeQuery()
  return (
    <div>
      <div>
        <strong>{data.me.username}</strong>
        <p>{post.text}</p>
        <LikeButton
          circleId={post.circleId}
          postId={post.id}
          hasLiked={post.hasLiked}
          likesCount={post.likesCount}
        />
      </div>
    </div>
  )
}

export default MyPost
