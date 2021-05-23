import React from "react"
import { Post, useDeletePostMutation } from "../generated/graphql"
import { formatTime } from "../utils/formatTime"
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
    | "imageUrl"
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
    <div
      key={post.id}
      className="card mb-1 shadow-sm"
      style={{ maxWidth: "500px" }}
    >
      <div className="card-body p-2">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <img
              src={`https://ui-avatars.com/api/?name=${username}`}
              className="img rounded-circle text-white mr-2 mt-1 mb-1"
              style={{ width: "2.2rem", height: "2.2rem" }}
            />
            <div>
              <h5 className="mb-0">{username}</h5>
              <small
                className={`d-block text-muted`}
                style={{ fontSize: "0.65rem" }}
              >
                {formatTime(post.createdAt)}
              </small>
            </div>
          </div>
          <button className="btn btn-danger btn-sm" onClick={handleDelete}>
            Delete
          </button>
        </div>

        {post.imageUrl && (
          <img
            src={post.imageUrl}
            className="img-fluid post__image"
            alt={`${username} shared an image`}
          />
        )}

        <p style={{ whiteSpace: "pre-wrap" }}>{post.text}</p>

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
