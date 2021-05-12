import React from "react"
import { usePostsQuery } from "../generated/graphql"

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
    <div>
      {data.posts.data.map((p) => (
        <div key={p.id}>
          <strong>{p.creator.username}</strong>
          <p>{p.text}</p>
        </div>
      ))}
      <button
        disabled={!data.posts.hasMore || loading}
        onClick={handleLoadMore}
      >
        Load More
      </button>
    </div>
  )
}

export default Posts
