import React from "react"
import Link from "next/link"
import { useLogoutMutation, useMeQuery } from "../generated/graphql"
import { useApolloClient } from "@apollo/client"
import { useRouter } from "next/router"

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
  const router = useRouter()
  const client = useApolloClient()
  const { data, loading, error } = useMeQuery()
  const [logoutUser, { loading: logoutLoading }] = useLogoutMutation()

  const handleLogout = async () => {
    const { data } = await logoutUser()
    if (data?.logout) {
      router.replace("/")
      client.cache.reset()
    } else {
      alert("something went wrong try refreshing")
    }
  }

  const getContent = () => {
    if (loading) {
      return <h4>Loading...</h4>
    } else if (error || !data?.me) {
      // No User
      return (
        <>
          <Link href="/">Home</Link> &nbsp; &nbsp;
          <Link href="/explore">Explore</Link> &nbsp; &nbsp;
          <Link href="/login">Login</Link>
        </>
      )
    } else {
      // User logged in
      return (
        <>
          <span>
            <strong>{data.me.username}</strong>
          </span>
          &nbsp; &nbsp;
          <Link href="/">Home</Link> &nbsp; &nbsp;
          <Link href="/createCircle">New Circle</Link> &nbsp; &nbsp;
          <Link href="/explore">Explore</Link> &nbsp; &nbsp;
          <button onClick={handleLogout} disabled={logoutLoading}>
            Logout
          </button>
          &nbsp; &nbsp;
        </>
      )
    }
  }

  return <div style={{ padding: "1rem" }}>{getContent()}</div>
}

export default Navbar
