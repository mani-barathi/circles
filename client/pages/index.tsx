import { useEffect } from "react";
import Invitation from "../components/Invitation";
import { useGetIntivationsLazyQuery } from "../generated/graphql";
import useAuth from "../hooks/useAuth";

export default function Home() {
  const { user, userLoading } = useAuth();
  const [getInvits, { data, loading, error }] = useGetIntivationsLazyQuery({
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    if (!user) return;
    getInvits();
  }, [user]);

  if (!user || userLoading) return <h3>Loading...</h3>;

  return (
    <div>
      <h1>Circles</h1>
      <div>
        <h3>Invitations</h3>
        {loading && <h4>loading Invitations...</h4>}
        {error && <h4>Something went wrong unable to get your Invitations</h4>}
        {data?.getIntivations.length === 0 && <h4>No Invitations</h4>}
        {data?.getIntivations.map((invitation) => (
          <Invitation key={invitation.createdAt} invitation={invitation} />
        ))}
      </div>
    </div>
  );
}
