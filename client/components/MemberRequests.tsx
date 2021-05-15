import { gql } from "@apollo/client"
import React, { useEffect, useState } from "react"
import client from "../apollo"
import {
  MemberRequest,
  MembersDocument,
  MembersQuery,
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
        update: (cache, { data }) => {
          if (!data || !data.acceptMemberRequest) return
          setMemberRequests((prev) =>
            prev.filter((mr) => mr.userId !== memberId)
          )
          const existingMembers = cache.readQuery<MembersQuery>({
            query: MembersDocument,
            variables: { circleId },
          })

          cache.writeQuery<MembersQuery>({
            query: MembersDocument,
            variables: { circleId },
            data: {
              members: {
                ...existingMembers.members,
                hasMore: true,
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
    <div className="mt-2">
      <h4>Member Requests</h4>
      {memberRequests.length === 0 && <p>No Member Request</p>}
      <ul className="list-group">
        {memberRequests.map((request) => (
          <li
            className="list-group-item d-flex justify-content-between align-items-center"
            key={request.userId}
          >
            <p className="m-0"> {request.user?.username}</p>
            <div className="ml-1">
              <button
                className="btn btn-info btn-sm"
                onClick={() => handleAcceptRequest(request.userId)}
              >
                Accept
              </button>
              &nbsp;
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDeclineRequest(request.userId)}
              >
                Decline
              </button>
            </div>
          </li>
        ))}
      </ul>
      {memberRequests.length > 0 && (
        <button
          className="btn btn-secondary btn-sm mt-2"
          onClick={handleLoadMore}
          disabled={!hasMore}
        >
          Load More
        </button>
      )}
    </div>
  )
}

export default MemberRequests
