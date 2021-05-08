import { useRouter } from "next/router"
import React from "react"
import SendCancelMemberRequest from "../../../components/SendCancelMemberRequest"
import { useCircleQuery, useMeQuery } from "../../../generated/graphql"

interface circlePageProps {}

const circlePage: React.FC<circlePageProps> = ({}) => {
  const router = useRouter()
  const { data: me } = useMeQuery()
  const { circleId } = router.query
  const { data, loading, error } = useCircleQuery({
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    skip: typeof circleId !== "string",
    variables: { circleId: parseInt(circleId as string) },
  })

  if (loading) return <h3>Loading...</h3>

  const goToSettingsPage = () => router.push(`/circle/${circleId}/settings`)
  const goToAdminPage = () => router.push(`/circle/${circleId}/admin`)

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
            Members: {data.circle.totalMembers}
          </h4>
          {data.circle.isMember && (
            <button onClick={goToSettingsPage}>Settings</button>
          )}
          {data.circle.isAdmin && (
            <>
              &nbsp;&nbsp;
              <button onClick={goToAdminPage}>Admin</button>
            </>
          )}
          <p>{data.circle.description}</p>
        </div>
      ) : (
        <p>{error?.message}</p>
      )}
    </div>
  )
}

export default circlePage
