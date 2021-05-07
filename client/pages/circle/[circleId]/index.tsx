import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import MemberRequest from "../../../components/MemberRequest"
import SentInvitations from "../../../components/SentInvitations"
import {
  useCircleQuery,
  useMeQuery,
  useSendInvitationMutation,
} from "../../../generated/graphql"

interface circlePageProps {}

const circlePage: React.FC<circlePageProps> = ({}) => {
  const router = useRouter()
  const [toggle, setToggle] = useState({
    showMembers: false,
    showSentInvitations: false,
  })
  const { data: me } = useMeQuery()
  const { circleId } = router.query
  const { data, loading, error } = useCircleQuery({
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    skip: typeof circleId !== "string",
    variables: { circleId: parseInt(circleId as string) },
  })
  const [sendInvitation] = useSendInvitationMutation()

  if (loading) return <h3>Loading...</h3>

  const handleInvite = async () => {
    setToggle({ showMembers: false, showSentInvitations: false })
    const recipiantName = prompt("Enter the username whom you want to invite")
    if (!recipiantName) return
    if (recipiantName.length < 3) {
      return alert("username cannot be less than 3 characters")
    }

    try {
      const { data } = await sendInvitation({
        variables: { circleId: parseInt(circleId as string), recipiantName },
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

  const handleToggle = (n: number) => {
    // toggle members
    if (n === 1) router.push(`/circle/${circleId}/members`)
    else
      setToggle((prev) => ({
        showMembers: false,
        showSentInvitations: !prev.showSentInvitations,
      }))
  }

  return (
    <div>
      {data ? (
        <div>
          <div>
            <h1>{data.circle.name}</h1>
            {me?.me?.id && !data.circle.isMember && (
              <MemberRequest circleId={circleId} />
            )}
          </div>
          <h4>
            Creator: {data.circle.creator.username} &nbsp;&nbsp; | &nbsp;&nbsp;
            Members: {data.circle.totalMembers}
          </h4>
          {data.circle.isMember && (
            <button onClick={() => handleToggle(1)}>Members</button>
          )}
          {data.circle.isAdmin && (
            <>
              &nbsp;
              <button onClick={handleInvite}>Invite New Member</button>
              &nbsp;
              <button onClick={() => handleToggle(0)}>sent Invitations</button>
              &nbsp;
            </>
          )}

          <div>
            {toggle.showSentInvitations && (
              <SentInvitations circleId={circleId} />
            )}
          </div>
          <p>{data.circle.description}</p>
        </div>
      ) : (
        <p>{error?.message}</p>
      )}
    </div>
  )
}

export default circlePage
