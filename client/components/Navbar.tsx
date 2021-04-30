import React from "react";
import Link from "next/link";
import { useMeQuery } from "../generated/graphql";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
  const { data, loading, error } = useMeQuery();

  const getContent = () => {
    if (loading) {
      return <h4>Loading...</h4>;
    } else if (error || !data.me) {
      return <Link href="/login">Login</Link>;
    } else {
      return (
        <>
          <span>{data.me.username}</span>&nbsp; &nbsp;
          <Link href="/">Home</Link> &nbsp; &nbsp;
          <Link href="/Logout">Logout</Link> &nbsp; &nbsp;
        </>
      );
    }
  };

  return <div style={{ padding: "1rem" }}>{getContent()}</div>;
};

export default Navbar;
