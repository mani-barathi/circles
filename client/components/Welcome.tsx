import Link from "next/link"
import React from "react"

interface WelcomeProps {}

const Welcome: React.FC<WelcomeProps> = ({}) => {
  return (
    <div>
      <h2>Welcome to Circles</h2>
      <h4>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae, neque.
      </h4>
      <Link href="/login">
        <a>
          <strong>Join</strong>
        </a>
      </Link>
    </div>
  )
}

export default Welcome
