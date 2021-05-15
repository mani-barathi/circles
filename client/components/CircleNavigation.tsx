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
    <ul className="nav nav-tabs">
      <li className="nav-item">
        <Link href={`/circle/${circleId}`}>
          <a className={`nav-link ${section === "feed" && "active"}`}>Feed</a>
        </Link>
      </li>
      <li className="nav-item">
        <Link href={`/circle/${circleId}/chat`}>
          <a className={`nav-link ${section === "chat" && "active"}`}>Chat</a>
        </Link>
      </li>
      <li className="nav-item">
        <Link href={`/circle/${circleId}/myposts`}>
          <a className={`nav-link ${section === "myposts" && "active"}`}>
            My Posts
          </a>
        </Link>
      </li>
      <li className="nav-item">
        <Link href={`/circle/${circleId}/settings`}>
          <a className={`nav-link ${section === "settings" && "active"}`}>
            Settings
          </a>
        </Link>
      </li>
    </ul>
  )
}

export default CircleNavigation
