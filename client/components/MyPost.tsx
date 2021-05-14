import React from "react"
import { Post, useDeletePostMutation } from "../generated/graphql"
import LikeButton from "./LikeButton"

interface MyPostProps {
  post: Pick<
    Post,
    | "id"
    | "text"
    | "createdAt"
    | "circleId"
    | "hasLiked"
    | "likesCount"
    | "__typename"
  >
  username: string
}

const MyPost: React.FC<MyPostProps> = ({ post, username }) => {
  const [deletePost, { loading }] = useDeletePostMutation({
    variables: {
      postId: post.id,
    },
    update: (cache, { data }) => {
      if (!data || !data.deletePost) return
      const normalizedId = cache.identify({
        id: post.id,
        __typename: post.__typename,
      })
      cache.evict({ id: normalizedId })
      cache.gc()
    },
  })

  const handleDelete = async () => {
    if (!confirm("Are you sure to delete?")) return
    try {
      await deletePost()
    } catch (e) {
      console.log(e)
      alert(e.message)
    }
  }

  return (
    <div>
      <div>
        <strong>{username}</strong>
        <button disabled={loading} onClick={handleDelete}>
          Delete
        </button>
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
