import Link from "next/link"
import { useRouter } from "next/router"
import React, { useEffect } from "react"
import Members from "../../../components/Members"
import PageNotFound from "../../../components/PageNotFound"
import {
  MeDocument,
  MeQuery,
  useCircleQuery,
  useExitCircleMutation,
  useMembersLazyQuery,
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
      {!circleData.circle.isAdmin && (
        <button disabled={exitGroupLoading} onClick={handleExitGroup}>
          Exit Group
        </button>
      )}
      <Members circleId={circleId} isAdmin={circleData.circle.isAdmin} />
    </div>
  )
}

export default info
