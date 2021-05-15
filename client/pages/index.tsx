import Link from "next/link"
import Invitations from "../components/Invitations"
import MyCircles from "../components/MyCircles"
import { useMeQuery } from "../generated/graphql"

export default function Home() {
  const { data: meData, loading: meLoading } = useMeQuery()

  if (meLoading) return <h3>Loading...</h3>
  if (!meData || !meData.me)
    return (
      <div className="py-2">
        <h2>Welcome to Circles</h2>
        <h4>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae, neque.
        </h4>
        <Link href="/login">
          <a className="btn btn-outline-info">Join</a>
        </Link>
      </div>
    )

  return (
    <div>
      <Invitations />
      <hr />
      <MyCircles />
    </div>
  )
}
