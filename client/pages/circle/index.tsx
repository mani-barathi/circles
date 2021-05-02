import React from "react";
import { useGetCirclesQuery } from "../../generated/graphql";

interface indexProps {}

const index: React.FC<indexProps> = ({}) => {
  const { data, loading, error } = useGetCirclesQuery();
  return (
    <div>
      <h1>All Circles</h1>

      {loading && <h3>Loading...</h3>}

      {data?.getCircles.map((circle) => (
        <div key={circle.id}>
          <h3>{circle.name}</h3>
          <strong>Creator : {circle.creator.username}</strong>
          <p>{circle.description}</p>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default index;
