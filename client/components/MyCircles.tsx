import Link from "next/link"
import React from "react"
import { useMyCirclesQuery } from "../generated/graphql"

interface MyCirclesProps {}

const MyCircles: React.FC<MyCirclesProps> = ({}) => {
  const { data, loading, error } = useMyCirclesQuery({
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  })

  if (loading) return <h3>Loading...</h3>
  if (error) return <p>{error.message}</p>

  return (
    <div>
      <h3>My Circles</h3>
      {data.myCircles.data.length === 0 && (
        <h4>
          You are not part of a circle, either join a cirle or create a circle
        </h4>
      )}
      {data.myCircles.data.map((circle) => (
        <li key={circle.name}>
          <strong>
            <Link href={`/circle/${circle.id}`}>{circle.name}</Link>
          </strong>
        </li>
      ))}
      <button disabled={!data.myCircles.hasMore}>Load More</button>
    </div>
  )
}

export default MyCircles
