import React from "react";
import Link from "next/link";
import { useApolloClient } from "@apollo/client";
import { useRouter } from "next/router";

import HomeIcon from "./icons/HomeIcon";
import PlusIcon from "./icons/PlusIcon";
import ArrowInIcon from "./icons/ArrowInIcon";
import SearchIcon from "./icons/SearchIcon";

import { useLogoutMutation, useMeQuery } from "../generated/graphql";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
  const router = useRouter();
  const client = useApolloClient();
  const { data, error, loading } = useMeQuery({
    fetchPolicy: "cache-first",
  });
  const [logoutUser, { loading: logoutLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    if (logoutLoading) return;
    try {
      const { data } = await logoutUser();
      if (data?.logout) {
        await client.cache.reset();
        await router.push("/");
      } else {
        alert("something went wrong try refreshing");
      }
    } catch (e) {
      console.log(e);
      alert("something went wrong try refreshing");
    }
  };

  return (
    <nav className="navbar navbar-dark bg-dark sticky-top w-100">
      <a className="navbar-brand ">Circles</a>
      <div className="d-flex ml-auto align-items-center">
        <NavLink href="/" icon={HomeIcon} text="Home" />

        {data?.me && (
          <NavLink href="/createCircle" icon={PlusIcon} text="New Circle" />
        )}

        <NavLink href="/explore" icon={SearchIcon} text="Explore" />

        {data?.me ? (
          <img
            src={` https://ui-avatars.com/api/?name=${data.me.username} `}
            onClick={handleLogout}
            className="img rounded-circle text-white"
            title="Logout"
            style={{ cursor: "pointer", width: "2rem", height: "2rem" }}
          />
        ) : (
          <NavLink href="/login" icon={ArrowInIcon} text="Login" />
        )}
      </div>
    </nav>
  );
};

interface NavLinkProps {
  text: string;
  icon: React.FC;
  href: string;
}

const NavLink: React.FC<NavLinkProps> = ({ text, icon: Icon, href }) => {
  return (
    <Link href={href}>
      <a className="nav-link active">
        {/* <span className="nav__linkText"> {text}</span> */}
        <span title={text}>
          <Icon />
        </span>
      </a>
    </Link>
  );
};

export default Navbar;
