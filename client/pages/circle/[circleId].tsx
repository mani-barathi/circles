import { useRouter } from "next/router";
import React, { useEffect } from "react";
import {
  useCircleLazyQuery,
  useSendInvitationMutation,
} from "../../generated/graphql";
import useAuth from "../../hooks/useAuth";

interface circlePageProps {}

const circlePage: React.FC<circlePageProps> = ({}) => {
  const router = useRouter();
  const { user, userLoading } = useAuth();
  const { circleId } = router.query;
  const [getCircle, { data, loading, error }] = useCircleLazyQuery({
    variables: { circleId: parseInt(circleId as string) },
    fetchPolicy: "cache-and-network",
  });
  const [sendInvitation] = useSendInvitationMutation();

  useEffect(() => {
    if (!user) return;
    getCircle();
  }, [user]);

  if (loading || userLoading) return <h3>Loading...</h3>;
  if (!userLoading && !user) return <h3>Not Authorized!</h3>;

  const handleInvite = async () => {
    const recipiantName = prompt("Enter the username whom you want to invite");
    if (recipiantName.length < 3) {
      return alert("username cannot be less than 3 characters");
    }

    try {
      const { data } = await sendInvitation({
        variables: { circleId: parseInt(circleId as string), recipiantName },
      });
      if (data?.sendInvitation.invitation) {
        console.log(data?.sendInvitation.invitation);
        alert("invitation sent");
      } else {
        alert(data?.sendInvitation.errors[0].message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {data ? (
        <div>
          <h1>{data.circle.name}</h1>
          {data.circle.isAdmin ? (
            <button onClick={handleInvite}>Invite New Member</button>
          ) : (
            <h3>creator: {data.circle.creator.username}</h3>
          )}
          <p>members: {data.circle.totalMembers}</p>
          <p>{data.circle.description}</p>
        </div>
      ) : (
        <p>{error?.message}</p>
      )}
    </div>
  );
};

export default circlePage;
