import Link from "next/link"
import { useRouter } from "next/router"
import React, { useEffect } from "react"
import PageNotFound from "../../../components/PageNotFound"
import {
  MeDocument,
  MembersDocument,
  MembersQuery,
  MeQuery,
  useCircleQuery,
  useExitCircleMutation,
  useMembersLazyQuery,
  useRemoveMemberMutation,
} from "../../../generated/graphql"

interface membersProps {}

const info: React.FC<membersProps> = ({}) => {
  const router = useRouter()
  const circleId =
    typeof router.query.circleId === "string"
      ? parseInt(router.query.circleId)
      : null
  const { data: circleData, loading: circleLoading } = useCircleQuery({
    variables: { circleId },
    skip: typeof router.query.circleId !== "string",
  })
  const [getMembers, { data, error, loading }] = useMembersLazyQuery({
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  })
  const [
    removeMember,
    { loading: removeMemberLoading },
  ] = useRemoveMemberMutation()
  const [exitGroup, { loading: exitGroupLoading }] = useExitCircleMutation()

  useEffect(() => {
    if (!circleData || typeof circleId !== "number") return
    if (circleData?.circle.isMember) {
      getMembers({ variables: { circleId } })
    }
  }, [circleId, circleData])

  if (loading || circleLoading) return <h4>Loading...</h4>
  if (error)
    return (
      <h4>
        Something went wrong <p>{error.message}</p>
      </h4>
    )

  if (!circleData?.circle.isMember) return <PageNotFound />

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
                members: existingMembers.members.members.filter(
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

  const handleExitGroup = async () => {
    if (!confirm("Are you sure to exit the circle?")) return
    try {
      await exitGroup({
        variables: { circleId },
        update: (cache, { data }) => {
          if (!data || !data.exitCircle) return

          const existingMe = cache.readQuery<MeQuery>({
            query: MeDocument,
          })
          cache.writeQuery<MeQuery>({
            query: MeDocument,
            data: {
              me: {
                ...existingMe.me,
                myCircles: existingMe.me.myCircles.filter(
                  (c) => c.id !== circleId.toString()
                ),
              },
            },
          })
        },
      })
      router.push("/")
    } catch (e) {
      console.log("handleExitGroup", e)
      alert(e)
    }
  }

  return (
    <div>
      <Link href={`/circle/${circleId}`}>
        <a>
          <h3>{circleData.circle.name}</h3>
        </a>
      </Link>
      <button disabled={exitGroupLoading} onClick={handleExitGroup}>
        Exit Group
      </button>
      <h4>Members:{data?.members.members.length}</h4>
      {data?.members.members.map((m) => (
        <li key={m.userId}>
          {m.user.username} &nbsp;
          {circleData?.circle.isAdmin && !m.isAdmin && (
            <button
              onClick={() => handleRemoveMember(m.userId)}
              disabled={removeMemberLoading}
            >
              Remove
            </button>
          )}
        </li>
      ))}
    </div>
  )
}

export default info
