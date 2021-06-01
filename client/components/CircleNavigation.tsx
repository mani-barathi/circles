import Link from "next/link"
import React from "react"
import ChatIcon from "./icons/ChatIcon"
import NewsIcon from "./icons/NewsIcon"
import PencilIcon from "./icons/PencilIcon"
import SettingsIcon from "./icons/SettingsIcon"
import StickyIcon from "./icons/StickyIcon"

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
        <CircleNavLink
          href={`/circle/${circleId}`}
          text="Feed"
          active={section === "feed"}
          icon={NewsIcon}
        />
      </li>
      <li className="nav-item">
        <CircleNavLink
          href={`/circle/${circleId}/chat`}
          text="Chat"
          active={section === "chat"}
          icon={ChatIcon}
        />
      </li>
      <li className="nav-item">
        <CircleNavLink
          href={`/circle/${circleId}/createpost`}
          text="New Post"
          active={section === "createpost"}
          icon={PencilIcon}
        />
      </li>
      <li className="nav-item">
        <CircleNavLink
          href={`/circle/${circleId}/myposts`}
          text="MyPosts"
          active={section === "myposts"}
          icon={StickyIcon}
        />
      </li>
      <li className="nav-item">
        <CircleNavLink
          href={`/circle/${circleId}/settings`}
          text="Settings"
          active={section === "settings"}
          icon={SettingsIcon}
        />
      </li>
    </ul>
  )
}

interface NavLinkProps {
  text: string
  icon?: React.FC
  href: string
  active: Boolean
}

const CircleNavLink: React.FC<NavLinkProps> = ({
  text,
  icon: Icon,
  href,
  active,
}) => {
  return (
    <Link href={href}>
      <a className={`nav-link ${active ? "active" : ""}`}>
        <span className="nav__linkText"> {text}</span>
        <span className="nav__linkIcon" title={text}>
          <Icon />
        </span>
      </a>
    </Link>
  )
}

export default CircleNavigation
