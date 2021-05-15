import { useRouter } from "next/router"
import React, { useEffect } from "react"
import CircleNavigation from "../../../components/CircleNavigation"
import MyPost from "../../../components/MyPost"
import PageNotFound from "../../../components/PageNotFound"
import Spinner from "../../../components/Spinner"
import {
  useCircleQuery,
  useMeQuery,
  useMyPostsLazyQuery,
} from "../../../generated/graphql"

interface mypostsProps {}

const myposts: React.FC<mypostsProps> = ({}) => {
  const router = useRouter()
  const { data: meData } = useMeQuery()
  const circleId =
    typeof router.query.circleId === "string"
      ? parseInt(router.query.circleId)
      : null
  const {
    data: circleData,
    loading: circleLoading,
    error: circleError,
  } = useCircleQuery({
    variables: { circleId },
    skip: typeof circleId !== "number",
  })
  const [getMyPosts, { data, loading, error, fetchMore }] = useMyPostsLazyQuery(
    {
      variables: { circleId },
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
    }
  )

  useEffect(() => {
    if (!circleData || !circleData.circle.isMember) return
    getMyPosts()
  }, [circleData])

  if (circleLoading || (loading && !data)) {
    return <Spinner center={true} large={true} />
  }
  if (circleError) return <p>{circleError.message}</p>
  if (error) return <p>{error.message}</p>

  if (!circleData) return null
  if (!circleData.circle.isMember) return <PageNotFound />
  if (!data) return null

  const handleLoadMore = async () => {
    const cursor = data.myPosts.data[data.myPosts.data.length - 1].createdAt
    try {
      await fetchMore({ variables: { circleId, cursor } })
    } catch (e) {
      console.log(e.message)
      alert(e.message)
    }
  }

  return (
    <div>
      <div>
        <h1>{circleData.circle.name}</h1>
      </div>
      <CircleNavigation circleId={circleId} section="myposts" />
      <div className="mt-2">
        {data.myPosts.data.length === 0 ? (
          <p>You don't have Posts. Try sharing One</p>
        ) : (
          data.myPosts.data.map((p) => (
            <MyPost post={p} username={meData.me.username} />
          ))
        )}

        {data.myPosts.data.length > 0 && (
          <button
            className="btn btn-secondary btn-sm mt-2 mb-5"
            disabled={!data.myPosts.hasMore || loading}
            onClick={handleLoadMore}
          >
            {loading && (
              <span className="spinner-border spinner-border-sm mr-2"></span>
            )}
            {loading ? "Loading..." : "Load More"}
          </button>
        )}
      </div>
    </div>
  )
}

export default myposts
