import { useRouter } from "next/router"
import React from "react"
import CircleNavigation from "../../../components/CircleNavigation"
import PageNotFound from "../../../components/PageNotFound"
import { useCircleQuery } from "../../../generated/graphql"

interface mypostsProps {}

const chat: React.FC<mypostsProps> = ({}) => {
  const router = useRouter()
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
  if (circleLoading) return <h4>Loading...</h4>
  if (circleError)
    return (
      <h4>
        Something went wrong <p>{circleError.message}</p>
      </h4>
    )

  if (!circleData) return null
  if (!circleData?.circle.isMember) return <PageNotFound />

  return (
    <div>
      <div>
        <h1>{circleData.circle.name}</h1>
      </div>
      <CircleNavigation circleId={circleId} section="chat" />
      <h3>Chat</h3>
    </div>
  )
}

export default chat
