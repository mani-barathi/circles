import Link from "next/link"
import { useRouter } from "next/router"
import React, { useEffect } from "react"
import MemberRequests from "../../../components/MemberRequests"
import Members from "../../../components/Members"
import PageNotFound from "../../../components/PageNotFound"
import {
  MyCirclesDocument,
  MyCirclesQuery,
  useCircleQuery,
  useExitCircleMutation,
  useMembersLazyQuery,
  useSendInvitationMutation,
} from "../../../generated/graphql"

interface membersProps {}

const info: React.FC<membersProps> = ({}) => {
  const router = useRouter()
  const circleId =
    typeof router.query.circleId === "string"
      ? parseInt(router.query.circleId)
      : null
  const {
    data: circleData,
    loading: circleLoading,
    error: circleError,
  } = useCircleQuery({
    variables: { circleId },
    skip: typeof circleId !== "number",
  })

  const [exitGroup, { loading: exitGroupLoading }] = useExitCircleMutation()
  const [sendInvitation] = useSendInvitationMutation()

  if (circleLoading) return <h4>Loading...</h4>
  if (circleError)
    return (
      <h4>
        Something went wrong <p>{circleError.message}</p>
      </h4>
    )

  if (!circleData) return null
  if (!circleData?.circle.isMember) return <PageNotFound />

  const handleExitGroup = async () => {
    if (!confirm("Are you sure to exit the circle?")) return
    try {
      await exitGroup({
        variables: { circleId },
        update: (cache, { data }) => {
          if (!data || !data.exitCircle) return
          cache.evict({ fieldName: "myCircles" })
        },
      })
      router.push("/")
    } catch (e) {
      console.log("handleExitGroup", e)
      router.push("/")
    }
  }

  const handleInvite = async () => {
    const recipiantName = prompt("Enter the username whom you want to invite")
    if (!recipiantName) return
    if (recipiantName.length < 3) {
      return alert("username cannot be less than 3 characters")
    }

    try {
      const { data } = await sendInvitation({
        variables: { circleId: circleId, recipiantName },
      })
      if (data?.sendInvitation.invitation) {
        alert("invitation sent")
      } else {
        alert(data?.sendInvitation.errors[0].message)
      }
    } catch (error) {
      console.log(error)
      alert(error.message)
    }
  }

  return (
    <div>
      <Link href={`/circle/${circleId}`}>
        <a>
          <h1>{circleData.circle.name}</h1>
        </a>
      </Link>
      {!circleData.circle.isAdmin && (
        <button disabled={exitGroupLoading} onClick={handleExitGroup}>
          Exit Group
        </button>
      )}

      {circleData.circle.isAdmin && (
        <>
          <button onClick={handleInvite}> Invite Member </button>
          <MemberRequests circleId={circleId} />
        </>
      )}
      <Members circleId={circleId} isAdmin={circleData.circle.isAdmin} />
    </div>
  )
}

export default info
