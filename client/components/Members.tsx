import React, { useState } from "react"
import {
  CircleDocument,
  CircleQuery,
  MembersDocument,
  MembersQuery,
  useMembersQuery,
  useRemoveMemberMutation,
} from "../generated/graphql"
import Spinner from "./Spinner"

interface MembersProps {
  circleId: number
  isAdmin: Boolean
  totalMembers: number
}

const Members: React.FC<MembersProps> = ({
  circleId,
  totalMembers,
  isAdmin,
}) => {
  const { data, error, loading, fetchMore } = useMembersQuery({
    variables: { circleId },
  })
  const [
    removeMember,
    { loading: removeMemberLoading },
  ] = useRemoveMemberMutation()

  if (loading) return <Spinner center={false} />
  if (error) return <h4>Somethin went wrong {error.message}</h4>
  if (!data) return null

  const handleRemoveMember = async (memberId: number) => {
    if (!confirm("Are you sure to remove this person from the circle?")) return
    const variables = { memberId, circleId }
    try {
      await removeMember({
        variables,
        update: (cache, { data }) => {
          if (!data || !data.removeMember) return
          // removing the member from the members list
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
                data: existingMembers.members.data.filter(
                  (m) => m.userId !== memberId
                ),
              },
            },
          })

          const existingCircle = cache.readQuery<CircleQuery>({
            query: CircleDocument,
            variables: { circleId },
          })

          cache.writeQuery<CircleQuery>({
            query: CircleDocument,
            variables: { circleId },
            data: {
              circle: {
                ...existingCircle.circle,
                totalMembers: existingCircle.circle.totalMembers - 1,
              },
            },
          }) // end of circle update
        }, // end of update
      }) // end of removeMember
    } catch (e) {
      console.log("handleRemoveMember:", e)
      alert(e.message)
    }
  }

  const handleLoadMore = async () => {
    const cursor = data.members.data[data.members.data.length - 1].createdAt
    try {
      await fetchMore({
        query: MembersDocument,
        variables: { circleId, cursor },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return previousResult
          return {
            members: {
              ...fetchMoreResult.members,
              data: [
                ...previousResult.members.data,
                ...fetchMoreResult.members.data,
              ],
            },
          }
        },
      })
    } catch (e) {
      console.log(e)
    }
  }
  return (
    <div>
      <h4 className="mt-1 mb-2">Members: {totalMembers}</h4>
      <ul className="list-group">
        {data.members.data.map((m) => (
          <li
            className="list-group-item d-flex justify-content-between align-items-center"
            key={m.userId}
          >
            <p className="m-0">{m.user?.username}</p>
            {isAdmin && !m.isAdmin && (
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleRemoveMember(m.userId)}
                disabled={removeMemberLoading}
              >
                Remove
              </button>
            )}
          </li>
        ))}
      </ul>
      {data.members.data.length > 0 && (
        <button
          className="btn btn-secondary btn-sm mt-2 mb-5"
          disabled={!data.members.hasMore}
          onClick={handleLoadMore}
        >
          {loading && (
            <span className="spinner-border spinner-border-sm mr-2"></span>
          )}
          {loading ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  )
}

export default Members
