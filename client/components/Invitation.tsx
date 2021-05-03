import React from "react";
import {
  Circle,
  GetIntivationsDocument,
  GetIntivationsQuery,
  Invitation,
  MeDocument,
  MeQuery,
  useAcceptInviteMutation,
  User,
} from "../generated/graphql";

interface InvitationProps {
  invitation: {
    __typename?: "Invitation";
  } & Pick<Invitation, "active" | "createdAt"> & {
      circle: {
        __typename?: "Circle";
      } & Pick<Circle, "id" | "name">;
      sender: Pick<User, "id" | "username">;
    };
}

const CircleInvitation: React.FC<InvitationProps> = ({ invitation }) => {
  const [acceptInvite, { loading: acceptLoading }] = useAcceptInviteMutation({
    variables: {
      circleId: parseInt(invitation.circle.id),
      senderId: parseInt(invitation.sender.id),
    },
  });
  const handleAcceptInvitation = async () => {
    try {
      const { data } = await acceptInvite({
        update: (cache, { data }) => {
          if (!data.acceptInvitation) return;

          const existingInvitations = cache.readQuery<GetIntivationsQuery>({
            query: GetIntivationsDocument,
          });
          cache.writeQuery<GetIntivationsQuery>({
            query: MeDocument,
            data: {
              getIntivations: existingInvitations.getIntivations.filter(
                (ele) => ele.circle.id !== data.acceptInvitation.id
              ),
            },
          });

          const existingMe = cache.readQuery<MeQuery>({
            query: MeDocument,
          });
          cache.writeQuery<MeQuery>({
            query: MeDocument,
            data: {
              me: {
                ...existingMe.me,
                myCircles: [data.acceptInvitation, ...existingMe.me.myCircles],
              },
            },
          });
        },
      });
      if (data) {
        // refetch();
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const handleRejectInvitation = () => {};
  return (
    <div>
      <strong>{invitation.circle.name}</strong> &nbsp;
      <span>{invitation.sender.username}</span> &nbsp;
      <button onClick={handleAcceptInvitation} disabled={acceptLoading}>
        accept
      </button>
      &nbsp;
      <button onClick={handleRejectInvitation}>reject</button>
    </div>
  );
};

export default CircleInvitation;
