import React from "react"
import { usePostsQuery } from "../generated/graphql"
import LikeButton from "./LikeButton"

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
        <div key={p.id} className="card mb-1 shadow-sm">
          <div className="card-body">
            <h5 className="card-title">{p.creator.username}</h5>
            <p className="card-text">{p.text}</p>
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
