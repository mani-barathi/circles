import Link from "next/link"
import { useRouter } from "next/router"
import React from "react"
import MemberRequests from "../../../components/MemberRequests"
import PageNotFound from "../../../components/PageNotFound"
import SentInvitations from "../../../components/SentInvitations"
import {
  useCircleQuery,
  useSendInvitationMutation,
} from "../../../generated/graphql"

interface adminProps {}

const admin: React.FC<adminProps> = () => {
  const router = useRouter()
  const circleId =
    typeof router.query.circleId === "string"
      ? parseInt(router.query.circleId)
      : null
  const { data: circleData, loading: circleLoading } = useCircleQuery({
    variables: { circleId },
    skip: typeof router.query.circleId !== "string",
  })
  const [sendInvitation] = useSendInvitationMutation()

  if (circleLoading || !circleData) return null
  if (!circleData.circle.isAdmin) return <PageNotFound />

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
    }
  }
  return (
    <div>
      <Link href={`/circle/${circleData.circle.id}`}>
        <a>
          <h2>{circleData.circle.name}</h2>
        </a>
      </Link>
      <h4>Admin Page</h4>
      <button onClick={handleInvite}>Invite New Member</button> &nbsp;
      <MemberRequests circleId={circleId} />
      <SentInvitations circleId={circleId.toString()} />
    </div>
  )
}

export default admin
