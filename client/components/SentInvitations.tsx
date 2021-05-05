import React from "react";
import {
  SentInvitaionsDocument,
  SentInvitaionsQuery,
  useCancelInvitationMutation,
  useSentInvitaionsQuery,
} from "../generated/graphql";

interface SentInvitationsProps {
  circleId: string | string[];
}

const SentInvitations: React.FC<SentInvitationsProps> = ({ circleId }) => {
  const { data, loading, error } = useSentInvitaionsQuery({
    variables: { circleId: parseInt(circleId as string) },
  });
  const [
    cancelInvitation,
    { loading: cancelInviteLoading },
  ] = useCancelInvitationMutation();

  if (loading) return <p>Loading....</p>;
  if (error) return <p>{error.message}</p>;

  const handleCancelInvitation = async (
    circleId: number,
    recipientId: number
  ) => {
    try {
      const { data, errors } = await cancelInvitation({
        variables: { circleId, recipientId },
        update: (cache, { data }) => {
          if (!data || !data.cancelInvitation) return;

          const existingInvitations = cache.readQuery<SentInvitaionsQuery>({
            query: SentInvitaionsDocument,
            variables: { circleId },
          });
          cache.writeQuery<SentInvitaionsQuery>({
            query: SentInvitaionsDocument,
            variables: { circleId },
            data: {
              getSentInvitationOfCircle: existingInvitations?.getSentInvitationOfCircle.filter(
                (e) => e.recipientId !== recipientId
              ),
            },
          });
        },
      });
      if (data?.cancelInvitation) {
        return alert("cancelled invitation succesfully!");
      }
      if (errors?.length > 0) {
        return alert(errors[0].message);
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  return (
    <div>
      <h4>Sent Invitations</h4>
      {data?.getSentInvitationOfCircle.length === 0 && (
        <p>No Invitations sent</p>
      )}
      {data?.getSentInvitationOfCircle.map((invitation) => (
        <li key={invitation.recipientId}>
          {invitation.recipient.username} &nbsp;
          <button
            disabled={cancelInviteLoading}
            onClick={() =>
              handleCancelInvitation(
                invitation.circleId,
                invitation.recipientId
              )
            }
          >
            Cancel
          </button>
        </li>
      ))}
    </div>
  );
};

export default SentInvitations;
