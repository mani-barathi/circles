import Link from "next/link"
import Invitations from "../components/Invitations"
import Welcome from "../components/Welcome"
import { useMeQuery } from "../generated/graphql"

export default function Home() {
  const { data: user, loading: userLoading } = useMeQuery({
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  })

  if (userLoading) return <h3>Loading...</h3>
  if (!user || !user.me) return <Welcome />

  return (
    <div>
      <h2>Circles</h2>

      <Invitations />
      <hr />

      <div>
        <h3>My Circles</h3>
        {user.me.myCircles.length === 0 && (
          <h4>
            You are not part of a circle, either join a cirle or create a circle
          </h4>
        )}
        {user.me.myCircles.map((circle) => (
          <strong style={{ display: "block" }} key={circle.name}>
            <Link href={`/circle/${circle.id}`}>{circle.name}</Link>
          </strong>
        ))}
      </div>
    </div>
  )
}
