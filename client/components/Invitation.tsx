import React from "react"
import {
  Circle,
  GetIntivationsDocument,
  GetIntivationsQuery,
  Invitation,
  MyCirclesDocument,
  MyCirclesQuery,
  useAcceptInviteMutation,
  User,
  useRejectInvitationMutation,
} from "../generated/graphql"

interface InvitationProps {
  invitation: {
    __typename?: "Invitation"
  } & Pick<Invitation, "active" | "createdAt"> & {
      circle: {
        __typename?: "Circle"
      } & Pick<Circle, "id" | "name">
      sender: Pick<User, "id" | "username">
    }
}

const CircleInvitation: React.FC<InvitationProps> = ({ invitation }) => {
  const [acceptInvite, { loading: acceptLoading }] = useAcceptInviteMutation({
    variables: {
      circleId: parseInt(invitation.circle.id),
      senderId: parseInt(invitation.sender.id),
    },
  })
  const [
    rejectInvite,
    { loading: rejectLoading },
  ] = useRejectInvitationMutation({
    variables: {
      circleId: parseInt(invitation.circle.id),
      senderId: parseInt(invitation.sender.id),
    },
  })
  const handleAcceptInvitation = async () => {
    try {
      await acceptInvite({
        update: (cache, { data }) => {
          if (!data.acceptInvitation) return

          const existingInvitations = cache.readQuery<GetIntivationsQuery>({
            query: GetIntivationsDocument,
          })
          cache.writeQuery<GetIntivationsQuery>({
            query: GetIntivationsDocument,
            data: {
              getIntivations: existingInvitations.getIntivations.filter(
                (ele) => ele.circle.id !== invitation.circle.id
              ),
            },
          })

          const existingCircles = cache.readQuery<MyCirclesQuery>({
            query: MyCirclesDocument,
          })
          cache.writeQuery<MyCirclesQuery>({
            query: MyCirclesDocument,
            data: {
              myCircles: {
                ...existingCircles.myCircles,
                data: existingCircles.myCircles.data.filter(
                  (c) => c.id !== invitation.circle.id
                ),
              },
            },
          })
        },
      })
    } catch (error) {
      console.log(error)
      alert(error)
    }
  }

  const handleRejectInvitation = async () => {
    try {
      await rejectInvite({
        update: (cache, { data }) => {
          if (!data) return
          const existingInvitations = cache.readQuery<GetIntivationsQuery>({
            query: GetIntivationsDocument,
          })
          console.log(existingInvitations)
          cache.writeQuery<GetIntivationsQuery>({
            query: GetIntivationsDocument,
            data: {
              getIntivations: existingInvitations.getIntivations.filter(
                (ele) => ele.circle.id !== invitation.circle.id
              ),
            },
          })
        },
      })
    } catch (error) {
      console.log(error)
      alert(error)
    }
  }
  return (
    <div>
      <strong>{invitation.circle.name}</strong> &nbsp;
      <span>{invitation.sender.username}</span> &nbsp;
      <button onClick={handleAcceptInvitation} disabled={acceptLoading}>
        accept
      </button>
      &nbsp;
      <button onClick={handleRejectInvitation} disabled={rejectLoading}>
        reject
      </button>
    </div>
  )
}

export default CircleInvitation
