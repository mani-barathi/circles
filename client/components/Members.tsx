import React from "react"
import {
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
  const { data, error, loading, fetchMore } = useMembersQuery({
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
      <h4>Members:</h4>
      {data.members.data.map((m) => (
        <li key={m.userId}>
          {m.user?.username} &nbsp;
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
      <button disabled={!data.members.hasMore} onClick={handleLoadMore}>
        Load More
      </button>
    </div>
  )
}

export default Members
