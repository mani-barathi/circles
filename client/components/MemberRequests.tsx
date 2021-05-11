import React, { useEffect, useState } from "react"
import {
  MemberRequest,
  useAcceptMemberRequestMutation,
  useDeclineMemberRequestMutation,
  useMemberRequestsQuery,
  User,
} from "../generated/graphql"

interface MemberRequestsProps {
  circleId: number
}
type CMemberRequest = {
  __typename?: "MemberRequest"
} & Pick<MemberRequest, "circleId" | "userId" | "createdAt"> & {
    user: {
      __typename?: "User"
    } & Pick<User, "id" | "username">
  }

const MemberRequests: React.FC<MemberRequestsProps> = ({ circleId }) => {
  const [memberRequests, setMemberRequests] = useState<CMemberRequest[]>([])
  const [hasMore, setHasMore] = useState(true)
  const { data, loading, error, fetchMore } = useMemberRequestsQuery({
    variables: { circleId },
    fetchPolicy: "no-cache",
    nextFetchPolicy: "cache-first",
  })

  useEffect(() => {
    if (!data) return
    setMemberRequests(data.memberRequests.data)
    setHasMore(data.memberRequests.hasMore)
  }, [data])

  const [acceptRequest] = useAcceptMemberRequestMutation()
  const [declineRequest] = useDeclineMemberRequestMutation()

  if (loading) return <h4>Loading...</h4>
  if (error) return <h4>Error: {error.message} </h4>

  const handleAcceptRequest = async (memberId: number) => {
    try {
      await acceptRequest({
        variables: { circleId, memberId },
        update: (_, { data }) => {
          if (!data || !data.acceptMemberRequest) return
          setMemberRequests((prev) =>
            prev.filter((mr) => mr.userId !== memberId)
          )
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
        update: (_, { data }) => {
          if (!data || !data.declineMemberRequest) return
          setMemberRequests((prev) =>
            prev.filter((mr) => mr.userId !== memberId)
          )
        },
      })
    } catch (e) {
      console.log(e)
      alert(e.message)
    }
  }

  const handleLoadMore = async () => {
    const cursor = memberRequests[memberRequests.length - 1].createdAt
    try {
      const { data } = await fetchMore({ variables: { cursor } })
      const newMemberRequests: any = data.memberRequests.data
      setMemberRequests((prev) => [...prev, ...newMemberRequests])
      setHasMore(data.memberRequests.hasMore)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div>
      <h4>Member Requests</h4>
      {memberRequests.length === 0 && <p>No Member Request</p>}
      {memberRequests.map((request) => (
        <li key={request.userId}>
          {request.user?.username} &nbsp;
          <button onClick={() => handleAcceptRequest(request.userId)}>
            Accept
          </button>
          &nbsp;
          <button onClick={() => handleDeclineRequest(request.userId)}>
            Decline
          </button>
        </li>
      ))}
      <button onClick={handleLoadMore} disabled={!hasMore}>
        Load More
      </button>
    </div>
  )
}

export default MemberRequests
