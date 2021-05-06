import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import SentInvitations from "../../../components/SentInvitations";
import {
  useCircleLazyQuery,
  useSendInvitationMutation,
} from "../../../generated/graphql";

interface circlePageProps {}

const circlePage: React.FC<circlePageProps> = ({}) => {
  const router = useRouter();
  const [toggle, setToggle] = useState({
    showMembers: false,
    showSentInvitations: false,
  });
  const { circleId } = router.query;
  const [getCircle, { data, loading, error }] = useCircleLazyQuery({
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });
  const [sendInvitation] = useSendInvitationMutation();

  useEffect(() => {
    const intId = typeof circleId === "string" ? parseInt(circleId) : -1;
    if (intId === -1) return;
    getCircle({ variables: { circleId: intId } });
  }, [circleId]);

  if (loading) return <h3>Loading...</h3>;

  const handleInvite = async () => {
    setToggle({ showMembers: false, showSentInvitations: false });
    const recipiantName = prompt("Enter the username whom you want to invite");
    if (!recipiantName) return;
    if (recipiantName.length < 3) {
      return alert("username cannot be less than 3 characters");
    }

    try {
      const { data } = await sendInvitation({
        variables: { circleId: parseInt(circleId as string), recipiantName },
      });
      if (data?.sendInvitation.invitation) {
        alert("invitation sent");
      } else {
        alert(data?.sendInvitation.errors[0].message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggle = (n: number) => {
    // toggle members
    if (n === 1) router.push(`/circle/${circleId}/info`);
    else
      setToggle((prev) => ({
        showMembers: false,
        showSentInvitations: !prev.showSentInvitations,
      }));
  };

  return (
    <div>
      {data ? (
        <div>
          <h1>{data.circle.name}</h1>
          <h4>Creator: {data.circle.creator.username}</h4>
          <div>Members: {data.circle.totalMembers}</div>
          {data.circle.isMember && (
            <button onClick={() => handleToggle(1)}>Info</button>
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
  );
};

export default circlePage;
