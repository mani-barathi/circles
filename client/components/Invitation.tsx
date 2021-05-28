import Link from "next/link"
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
      senderId: invitation.sender.id,
    },
  })
  const [rejectInvite, { loading: rejectLoading }] =
    useRejectInvitationMutation({
      variables: {
        circleId: parseInt(invitation.circle.id),
        senderId: invitation.sender.id,
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
                data: [
                  {
                    ...invitation.circle,
                    isAdmin: false,
                    isPublic: false,
                    updatedAt: new Date().getTime().toString(),
                  },
                  ...existingCircles.myCircles.data,
                ],
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
    <div className="">
      <div>
        <Link href={`/circle/${invitation.circle.id}`}>
          <a className="text-primary font-weight-bold">
            {invitation.circle.name}
          </a>
        </Link>
        <p className="m-0">{invitation.sender.username}</p>
      </div>
      <button
        className="btn btn-sm btn-info mr-2"
        onClick={handleAcceptInvitation}
        disabled={acceptLoading}
      >
        Accept
      </button>
      <button
        className="btn btn-sm btn-secondary"
        onClick={handleRejectInvitation}
        disabled={rejectLoading}
      >
        Decline
      </button>
    </div>
  )
}

export default CircleInvitation
