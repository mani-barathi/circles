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
    <div className="mt-3">
      <h3>Invitations</h3>
      {loading && <h6>loading Invitations...</h6>}
      {error && <h6>Something went wrong unable to get your Invitations</h6>}
      {data?.getIntivations.length === 0 && <h6>No Invitations</h6>}
      {data?.getIntivations.map((invitation) => (
        <Invitation key={invitation.createdAt} invitation={invitation} />
      ))}
    </div>
  )
}

export default Invitations
