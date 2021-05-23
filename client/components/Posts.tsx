import React from "react"
import { usePostsQuery } from "../generated/graphql"
import LikeButton from "./LikeButton"
import { formatTime } from "../utils/formatTime"

interface PostsProps {
  circleId: number
}

const Posts: React.FC<PostsProps> = ({ circleId }) => {
  const { data, loading, error, fetchMore } = usePostsQuery({
    variables: { circleId },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
  })

  if (loading && !data) return <p>loading...</p>
  if (error) return <p>{error.message}</p>
  if (!data) return null

  const handleLoadMore = async () => {
    const cursor = data.posts.data[data.posts.data.length - 1].createdAt
    try {
      await fetchMore({ variables: { circleId, cursor } })
    } catch (e) {
      console.log(e.message)
      alert(e.message)
    }
  }

  return (
    <div className="mt-1">
      {data.posts.data.map((p) => (
        <div
          key={p.id}
          className="card mb-1 shadow-sm"
          style={{ maxWidth: "500px" }}
        >
          <div className="card-body p-2">
            <div className="d-flex align-items-center">
              <img
                src={`https://ui-avatars.com/api/?name=${p.creator.username}`}
                className="img rounded-circle text-white mr-2 mt-1 mb-1"
                style={{ width: "2.2rem", height: "2.2rem" }}
              />
              <div>
                <h5 className="mb-0">{p.creator.username}</h5>
                <small
                  className={`d-block text-muted`}
                  style={{ fontSize: "0.65rem" }}
                >
                  {formatTime(p.createdAt)}
                </small>
              </div>
            </div>
            {p.imageUrl && (
              <img
                src={p.imageUrl}
                className="img-fluid post__image"
                alt={`${p.creator.username} shared an image`}
              />
            )}
            <p style={{ whiteSpace: "pre-wrap" }}>{p.text}</p>
            <LikeButton
              circleId={circleId}
              postId={p.id}
              hasLiked={p.hasLiked}
              likesCount={p.likesCount}
            />
          </div>
        </div>
      ))}

      <button
        className="btn btn-secondary btn-sm mt-3 mb-5"
        disabled={!data.posts.hasMore || loading}
        onClick={handleLoadMore}
      >
        {loading && (
          <span className="spinner-border spinner-border-sm mr-2"></span>
        )}
        {loading ? "Loading..." : "Load More"}
      </button>
    </div>
  )
}

export default Posts
