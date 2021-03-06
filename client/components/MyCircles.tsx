import Link from "next/link"
import React from "react"
import { useMyCirclesQuery } from "../generated/graphql"
import Spinner from "./Spinner"

interface MyCirclesProps {}

const MyCircles: React.FC<MyCirclesProps> = ({}) => {
  const { data, loading, error, fetchMore } = useMyCirclesQuery({
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  })

  if (loading && !data) return <Spinner center={false} />
  if (error) return <p>{error.message}</p>

  const handleLoadMore = async () => {
    const cursor = data.myCircles.data[data.myCircles.data.length - 1].updatedAt
    try {
      await fetchMore({ variables: { cursor } })
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div>
      <h3>My Circles</h3>
      {data.myCircles.data.length === 0 && (
        <p className="text-bold">
          You are not part of a circle, either join a cirle or create a circle{" "}
        </p>
      )}
      <ul className="list-group">
        {data.myCircles.data.map((circle) => (
          <Link href={`/circle/${circle.id}`} key={circle.name}>
            <a className="list-group-item list-group-item-action font-weight-bold">
              {circle.name}
            </a>
          </Link>
        ))}
      </ul>
      <button
        className="btn btn-sm btn-primary mt-1"
        disabled={!data.myCircles.hasMore || loading}
        onClick={handleLoadMore}
      >
        Load More
      </button>
    </div>
  )
}

export default MyCircles
