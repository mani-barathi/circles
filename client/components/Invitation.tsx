import React from "react";
import { Circle, Invitation, User } from "../generated/graphql";

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
  return (
    <div>
      <strong>{invitation.circle.name}</strong> &nbsp;
      <span>{invitation.sender.username}</span> &nbsp;
      <button>accept</button> &nbsp;
      <button>reject</button> &nbsp;
    </div>
  );
};

export default CircleInvitation;
