import React from "react"
import { useGetIntivationsQuery } from "../generated/graphql"
import Invitation from "./Invitation"

interface InvitationsProps {}

const Invitations: React.FC<InvitationsProps> = ({}) => {
  const { data, loading, error } = useGetIntivationsQuery({
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  })
  return (
    <div>
      <h3>Invitations</h3>
      {loading && <h4>loading Invitations...</h4>}
      {error && <h4>Something went wrong unable to get your Invitations</h4>}
      {data?.getIntivations.length === 0 && <h4>No Invitations</h4>}
      {data?.getIntivations.map((invitation) => (
        <Invitation key={invitation.createdAt} invitation={invitation} />
      ))}
    </div>
  )
}

export default Invitations
