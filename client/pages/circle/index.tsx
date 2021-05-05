import React from "react";
import Link from "next/link";
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
          <Link href={`/circle/${circle.id}`}>
            <a>
              <h3>{circle.name}</h3>
            </a>
          </Link>
          <h4>Creator : {circle.creator.username}</h4>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default index;
