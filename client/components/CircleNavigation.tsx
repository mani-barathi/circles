import Link from "next/link"
import React from "react"

interface CircleNavigationProps {
  circleId: number
  section: string
}

const CircleNavigation: React.FC<CircleNavigationProps> = ({
  circleId,
  section,
}) => {
  return (
    <h3>
      <Link href={`/circle/${circleId}`}>Feed</Link> &nbsp;&nbsp; | &nbsp;&nbsp;
      <Link href={`/circle/${circleId}/chat`}>Chat</Link> &nbsp;&nbsp; |
      &nbsp;&nbsp;
      <Link href={`/circle/${circleId}/myposts`}>My Posts</Link>
      &nbsp;&nbsp; | &nbsp;&nbsp;
      <Link href={`/circle/${circleId}/settings`}>Settings</Link>
    </h3>
  )
}

export default CircleNavigation
