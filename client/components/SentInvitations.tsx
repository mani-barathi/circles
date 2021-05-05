import React from "react";
import { useSentInvitaionsQuery } from "../generated/graphql";

interface SentInvitationsProps {
  circleId: string | string[];
}

const SentInvitations: React.FC<SentInvitationsProps> = ({ circleId }) => {
  const { data, loading, error } = useSentInvitaionsQuery({
    variables: { circleId: parseInt(circleId as string) },
  });

  if (loading) return <p>Loading....</p>;
  if (error) return <p>{error.message}</p>;

  const handleCancelInvitation = (circleId: number, recipientId: number) => {
    console.log("circleId: ", circleId);
    console.log("recipientId: ", recipientId);
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
