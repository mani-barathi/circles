import React from "react"
import Link from "next/link"
import { useLogoutMutation, useMeQuery } from "../generated/graphql"
import { useApolloClient } from "@apollo/client"
import { useRouter } from "next/router"

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
  const router = useRouter()
  const client = useApolloClient()
  const { data, error, loading } = useMeQuery({
    fetchPolicy: "cache-first",
  })
  const [logoutUser, { loading: logoutLoading }] = useLogoutMutation()

  const handleLogout = async () => {
    const { data } = await logoutUser()
    if (data?.logout) {
      await client.cache.reset()
      await router.push("/")
    } else {
      alert("something went wrong try refreshing")
    }
  }

  return (
    <nav className="navbar navbar-dark bg-dark sticky-top">
      <a className="navbar-brand ">Circles</a>
      <div className="d-flex ml-auto ">
        <Link href="/">
          <a className="nav-link active ">Home </a>
        </Link>
        {data?.me && (
          <Link href="/createCircle">
            <a className="nav-link active ">New Circle </a>
          </Link>
        )}
        <Link href="/explore">
          <a className="nav-link active ">Explore </a>
        </Link>
        {data?.me ? (
          <button
            disabled={logoutLoading}
            onClick={handleLogout}
            className="btn text-white"
          >
            Logout
          </button>
        ) : (
          <Link href="/login">
            <a className="nav-link active ">Login </a>
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar
