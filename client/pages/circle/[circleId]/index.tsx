import Link from "next/link"
import { useRouter } from "next/router"
import React from "react"
import SendCancelMemberRequest from "../../../components/SendCancelMemberRequest"
import { useCircleQuery, useMeQuery } from "../../../generated/graphql"

interface circlePageProps {}

const circlePage: React.FC<circlePageProps> = ({}) => {
  const router = useRouter()
  const { data: me } = useMeQuery()
  const circleId =
    typeof router.query.circleId === "string"
      ? parseInt(router.query.circleId)
      : null
  const { data, loading, error } = useCircleQuery({
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    skip: typeof circleId !== "number",
    variables: { circleId },
  })

  if (loading) return <h3>Loading...</h3>

  return (
    <div>
      {data ? (
        <div>
          <div>
            <h1>{data.circle.name}</h1>
            {me?.me?.id && !data.circle.isMember && (
              <SendCancelMemberRequest circleId={circleId} />
            )}
          </div>
          <h4>
            Creator: {data.circle.creator.username} &nbsp;&nbsp; | &nbsp;&nbsp;
            Members: {data.circle.totalMembers}&nbsp;&nbsp; | &nbsp;&nbsp;
            {data.circle.isMember && (
              <Link href={`/circle/${circleId}/settings`}>Settings</Link>
            )}
          </h4>
          <p>{data.circle.description}</p>
        </div>
      ) : (
        <p>{error?.message}</p>
      )}
    </div>
  )
}

export default circlePage
