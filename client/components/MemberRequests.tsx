import React from "react"
import { useMemberRequestsQuery } from "../generated/graphql"

interface MemberRequestsProps {
  circleId: number
}

const MemberRequests: React.FC<MemberRequestsProps> = ({ circleId }) => {
  const { data, loading, error } = useMemberRequestsQuery({
    variables: { circleId },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  })

  if (loading) return <h4>Loading...</h4>
  if (error) return <h4>Error: {error.message} </h4>
  if (!data) return null

  const handleAcceptRequest = (userId: number) => {
    console.log("handleAcceptRequest", userId)
  }
  const handleDeclineRequest = (userId: number) => {
    console.log("handleDeclineRequest", userId)
  }

  return (
    <div>
      <h4>Member Requests</h4>
      {data?.memberRequests.requests.length === 0 && <p>No Member Request</p>}
      {data?.memberRequests.requests.map((request) => (
        <li key={request.userId}>
          {request.user.username} &nbsp;
          <button onClick={() => handleAcceptRequest(request.userId)}>
            Accept
          </button>
          &nbsp;
          <button onClick={() => handleDeclineRequest(request.userId)}>
            Decline
          </button>
        </li>
      ))}
      <button disabled={!data.memberRequests.hasMore}>Load More</button>
    </div>
  )
}

export default MemberRequests
