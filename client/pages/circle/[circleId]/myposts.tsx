import { useRouter } from "next/router"
import React, { useEffect } from "react"
import CircleNavigation from "../../../components/CircleNavigation"
import MyPost from "../../../components/MyPost"
import PageNotFound from "../../../components/PageNotFound"
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

  if (circleLoading || (loading && !data)) return <h4>Loading...</h4>
  if (circleError) return <p>{circleError.message}</p>
  if (error) return <p>{error.message}</p>

  if (!circleData || !data) return null
  if (!circleData?.circle.isMember) return <PageNotFound />

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
      <h3>My Posts</h3>
      {data.myPosts.data.map((p) => (
        <MyPost post={p} username={meData.me.username} />
      ))}
      <button
        disabled={!data.myPosts.hasMore || loading}
        onClick={handleLoadMore}
      >
        Load More
      </button>
    </div>
  )
}

export default myposts
