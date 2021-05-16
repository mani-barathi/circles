import { useRouter } from "next/router"
import React from "react"
import CircleNavigation from "../../../components/CircleNavigation"
import MessageInput from "../../../components/MessageInput"
import PageNotFound from "../../../components/PageNotFound"
import Spinner from "../../../components/Spinner"
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
  if (circleLoading) return <Spinner center={true} large={true} />
  if (circleError)
    return (
      <h4>
        Something went wrong <p>{circleError.message}</p>
      </h4>
    )

  if (!circleData) return null
  if (!circleData?.circle.isMember) return <PageNotFound />

  return (
    <div className="h-100 d-flex flex-column flex-grow-1">
      <h1>{circleData.circle.name}</h1>
      <CircleNavigation circleId={circleId} section="chat" />
      <div className="flex-grow-1 py-2">messages</div>
      <MessageInput circleId={circleId} />
    </div>
  )
}

export default chat
