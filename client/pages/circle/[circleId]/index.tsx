import Link from "next/link"
import { useRouter } from "next/router"
import React from "react"
import CircleNavigation from "../../../components/CircleNavigation"
import CreatePost from "../../../components/CreatePost"
import Posts from "../../../components/Posts"
import SendCancelMemberRequest from "../../../components/SendCancelMemberRequest"
import Spinner from "../../../components/Spinner"
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

  if (loading) return <Spinner center={true} large={true} />

  return (
    <div className="app__window">
      {data ? (
        <div>
          <div>
            <div className="d-flex justify-content-between align-items-center">
              <h1>{data.circle.name}</h1>
              {me?.me?.id && !data.circle.isMember && (
                <SendCancelMemberRequest circleId={circleId} />
              )}
            </div>
            <div className="font-weight-bold">
              <span> Creator: {data.circle.creator.username}</span>
              <span className="ml-3">Members: {data.circle.totalMembers}</span>
            </div>
          </div>

          {!data.circle.isMember && <p>{data.circle.description}</p>}

          {data.circle.isMember && (
            <>
              <CircleNavigation circleId={circleId} section="feed" />
              <CreatePost circleId={circleId} />
              <Posts circleId={circleId} />
            </>
          )}
        </div>
      ) : (
        <p>{error?.message}</p>
      )}
    </div>
  )
}

export default circlePage
