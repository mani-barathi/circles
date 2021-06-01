import gql from "graphql-tag"
import { useRouter } from "next/router"
import React from "react"
import CircleNavigation from "../../../components/CircleNavigation"
import MemberRequests from "../../../components/MemberRequests"
import Members from "../../../components/Members"
import PageNotFound from "../../../components/PageNotFound"
import Spinner from "../../../components/Spinner"
import {
  useCircleQuery,
  useExitCircleMutation,
  useTogglePublicCircleMutation,
} from "../../../generated/graphql"

interface membersProps {}

const info: React.FC<membersProps> = ({}) => {
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

  const [exitGroup, { loading: exitGroupLoading }] = useExitCircleMutation()
  const [togglePublic, { loading: togglePublicLoading }] =
    useTogglePublicCircleMutation()

  if (circleLoading) return <Spinner center={true} large={true} />
  if (circleError)
    return (
      <h4>
        Something went wrong <p>{circleError.message}</p>
      </h4>
    )

  if (!circleData) return null
  if (!circleData?.circle.isMember) return <PageNotFound />

  const handleExitGroup = async () => {
    if (!confirm("Are you sure to exit the circle?")) return
    try {
      await exitGroup({
        variables: { circleId },
        update: (cache, { data }) => {
          if (!data || !data.exitCircle) return
          cache.evict({ fieldName: "myCircles" })
        },
      })
      router.push("/")
    } catch (e) {
      console.log("handleExitGroup", e)
      router.push("/")
    }
  }

  const handleTogglePublic = async () => {
    const variables = {
      circleId,
      isPublic: !circleData.circle.isPublic,
    }
    const promptText = variables.isPublic
      ? "Are you sure to make the circle public?"
      : "Are you to make the circle private?"

    if (!confirm(promptText)) return

    try {
      await togglePublic({
        variables,
        update: (cache, { data }) => {
          if (!data || !data.togglePublicCircle) return

          cache.writeFragment({
            id: "Circle:" + circleId,
            fragment: gql`
              fragment __ on Circle {
                isPublic
              }
            `,
            data: { isPublic: !circleData.circle.isPublic },
          })
        },
      })
    } catch (e) {
      console.log("handleExitGroup", e)
      router.push("/")
    }
  }

  return (
    <div className="app__window">
      <div>
        <div className="d-flex justify-content-between align-items-center">
          <h1>{circleData.circle.name}</h1>
          {!circleData.circle.isAdmin ? (
            <button
              className="btn btn-danger"
              disabled={exitGroupLoading}
              onClick={handleExitGroup}
            >
              Exit Circle
            </button>
          ) : (
            <button
              className="btn btn-info btn-sm"
              disabled={togglePublicLoading}
              onClick={handleTogglePublic}
            >
              Public : {circleData.circle.isPublic ? "On" : "Off"}
            </button>
          )}
        </div>
        <div className="font-weight-bold">
          <span> Creator: {circleData.circle.creator.username}</span>
          <span className="ml-3">
            Members: {circleData.circle.totalMembers}
          </span>
        </div>
      </div>

      <CircleNavigation circleId={circleId} section="settings" />

      {circleData.circle.description && <p>{circleData.circle.description}</p>}

      {circleData.circle.isAdmin && !circleData.circle.isPublic && (
        <>
          <MemberRequests circleId={circleId} />
          <hr />
        </>
      )}
      <Members
        circleId={circleId}
        totalMembers={circleData.circle.totalMembers}
        isAdmin={circleData.circle.isAdmin}
      />
    </div>
  )
}

export default info
