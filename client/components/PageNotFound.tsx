import Link from "next/link"
import React from "react"

interface Props {}

const PageNotFound: React.FC<Props> = () => {
  return (
    <div>
      <h3>Page Not found (404)</h3>
      <Link href={"/"}>
        <a>Go To Home</a>
      </Link>
    </div>
  )
}

export default PageNotFound
