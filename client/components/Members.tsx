import React from "react"
import {
  CircleDocument,
  CircleQuery,
  MembersDocument,
  MembersQuery,
  useMembersQuery,
  useRemoveMemberMutation,
} from "../generated/graphql"

interface MembersProps {
  circleId: number
  isAdmin: Boolean
}

const Members: React.FC<MembersProps> = ({ circleId, isAdmin }) => {
  const { data, error, loading } = useMembersQuery({
    variables: { circleId },
  })
  const [
    removeMember,
    { loading: removeMemberLoading },
  ] = useRemoveMemberMutation()

  if (loading) return <h4>Loading...</h4>
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

          // reducing the count of the totalMembers in circle Query
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
          })
        }, // end of update
      }) // end of removeMember
    } catch (e) {
      console.log("handleRemoveMember:", e)
      alert(e.message)
    }
  }

  return (
    <div>
      <h4>Members:</h4>
      {data.members.data.map((m) => (
        <li key={m.userId}>
          {m.user.username} &nbsp;
          {isAdmin && !m.isAdmin && (
            <button
              onClick={() => handleRemoveMember(m.userId)}
              disabled={removeMemberLoading}
            >
              Remove
            </button>
          )}
        </li>
      ))}
      <button disabled={!data.members.hasMore}>Load More</button>
    </div>
  )
}

export default Members
