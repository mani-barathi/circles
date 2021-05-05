import React from "react";
import { useMembersLazyQuery, useMembersQuery } from "../generated/graphql";

interface MembersProps {
  circleId: string | string[];
}

const Members: React.FC<MembersProps> = ({ circleId }) => {
  const { data, error, loading } = useMembersQuery({
    variables: { circleId: parseInt(circleId as string) },
  });
  if (loading) return <h4>Loading...</h4>;
  if (error) return <h4>Somethin went wrong {error.message}</h4>;
  return (
    <div>
      <h4>Members:</h4>
      {data.members.members.map((m) => (
        <li key={m.userId}>{m.user.username}</li>
      ))}
    </div>
  );
};

export default Members;
