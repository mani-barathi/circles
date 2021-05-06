import React from "react";
import {
  CircleDocument,
  CircleQuery,
  MembersDocument,
  MembersQuery,
  useMembersQuery,
  useRemoveMemberMutation,
} from "../generated/graphql";

interface MembersProps {
  circleId: string | string[];
  isAdmin: Boolean;
}

const Members: React.FC<MembersProps> = ({ circleId, isAdmin }) => {
  const { data, error, loading } = useMembersQuery({
    variables: { circleId: parseInt(circleId as string) },
  });
  const [
    removeMember,
    { loading: removeMemberLoading },
  ] = useRemoveMemberMutation();

  if (loading) return <h4>Loading...</h4>;
  if (error) return <h4>Somethin went wrong {error.message}</h4>;

  const handleRemoveMember = async (memberId: number) => {
    if (!confirm("Are you sure to remove this person from the circle?")) return;
    const variables = { memberId, circleId: parseInt(circleId as string) };
    try {
      const { data } = await removeMember({
        variables,
        update: (cache, { data }) => {
          if (!data || !data.removeMember) return;
          // removing the member from the members list
          const existingMembers = cache.readQuery<MembersQuery>({
            query: MembersDocument,
            variables: { circleId: parseInt(circleId as string) },
          });

          cache.writeQuery<MembersQuery>({
            query: MembersDocument,
            variables: { circleId: parseInt(circleId as string) },
            data: {
              members: {
                ...existingMembers.members,
                members: existingMembers.members.members.filter(
                  (m) => m.userId !== memberId
                ),
              },
            },
          });

          // reducing the count of the totalMembers in circle Query
          const existingCircle = cache.readQuery<CircleQuery>({
            query: CircleDocument,
            variables: { circleId: parseInt(circleId as string) },
          });
          cache.writeQuery<CircleQuery>({
            query: CircleDocument,
            variables: { circleId: parseInt(circleId as string) },
            data: {
              circle: {
                ...existingCircle.circle,
                totalMembers: existingCircle.circle.totalMembers - 1,
              },
            },
          });
        }, // end of update
      }); // end of removeMember
    } catch (e) {
      console.log("handleRemoveMember:", e);
      alert(e.message);
    }
  };

  return (
    <div>
      <h4>Members:</h4>
      {data.members.members.map((m) => (
        <li key={m.userId}>
          {m.user.username} &nbsp;
          {isAdmin && !m.isAdmin && (
            <button
              onClick={() => handleRemoveMember(m.userId)}
              disabled={removeMemberLoading}
            >
              Remove
            </button>
          )}
        </li>
      ))}
    </div>
  );
};

export default Members;
