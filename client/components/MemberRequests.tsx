import React from "react"
import {
  MemberRequestsDocument,
  MemberRequestsQuery,
  useAcceptMemberRequestMutation,
  useDeclineMemberRequestMutation,
  useMemberRequestsQuery,
} from "../generated/graphql"

interface MemberRequestsProps {
  circleId: number
}

const MemberRequests: React.FC<MemberRequestsProps> = ({ circleId }) => {
  const { data, loading, error } = useMemberRequestsQuery({
    variables: { circleId },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  })
  const [acceptRequest] = useAcceptMemberRequestMutation()
  const [declineRequest] = useDeclineMemberRequestMutation()

  if (loading) return <h4>Loading...</h4>
  if (error) return <h4>Error: {error.message} </h4>
  if (!data) return null

  const handleAcceptRequest = async (memberId: number) => {
    try {
      await acceptRequest({
        variables: { circleId, memberId },
        update: (cache, { data }) => {
          if (!data || !data.acceptMemberRequest) return

          const existingRequests = cache.readQuery<MemberRequestsQuery>({
            query: MemberRequestsDocument,
            variables: { circleId },
          })
          console.log(existingRequests)
          cache.writeQuery<MemberRequestsQuery>({
            query: MemberRequestsDocument,
            variables: { circleId },
            data: {
              memberRequests: {
                ...existingRequests.memberRequests,
                data: existingRequests.memberRequests.data.filter(
                  (mr) => mr.userId !== memberId
                ),
              },
            },
          })
        },
      })
    } catch (e) {
      console.log(e)
      alert(e.message)
    }
  }

  const handleDeclineRequest = async (memberId: number) => {
    if (!confirm("Are you sure to decline the Member Request?")) return

    try {
      await declineRequest({
        variables: { circleId, memberId },
        update: (cache, { data }) => {
          if (!data || !data.declineMemberRequest) return

          const existingRequests = cache.readQuery<MemberRequestsQuery>({
            query: MemberRequestsDocument,
            variables: { circleId },
          })
          console.log(existingRequests)
          cache.writeQuery<MemberRequestsQuery>({
            query: MemberRequestsDocument,
            variables: { circleId },
            data: {
              memberRequests: {
                ...existingRequests.memberRequests,
                data: existingRequests.memberRequests.data.filter(
                  (mr) => mr.userId !== memberId
                ),
              },
            },
          })
        },
      })
    } catch (e) {
      console.log(e)
      alert(e.message)
    }
  }

  return (
    <div>
      <h4>Member Requests</h4>
      {data?.memberRequests.data.length === 0 && <p>No Member Request</p>}
      {data?.memberRequests.data.map((request) => (
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
