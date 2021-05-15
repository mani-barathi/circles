import Link from "next/link"
import React from "react"

interface Props {}

const PageNotFound: React.FC<Props> = () => {
  return (
    <div className="d-flex flex-column align-items-center py-5">
      <h2>Page Not found (404)</h2>
      <Link href={"/"}>
        <a className="btn btn-outline-info">Go To Home</a>
      </Link>
    </div>
  )
}

export default PageNotFound
