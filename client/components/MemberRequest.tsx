import React from "react"
import {
  IsMemberRequestExistsDocument,
  IsMemberRequestExistsQuery,
  useCancelMemberRequestMutation,
  useIsMemberRequestExistsQuery,
  useSendMemberRequestMutation,
} from "../generated/graphql"

interface MemberRequestProps {
  circleId: string | string[]
}

const MemberRequest: React.FC<MemberRequestProps> = ({ circleId }) => {
  const { data, loading, error } = useIsMemberRequestExistsQuery({
    variables: { circleId: parseInt(circleId as string) },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  })
  const [
    sendRequest,
    { loading: sendRequsetLoading },
  ] = useSendMemberRequestMutation({
    variables: { circleId: parseInt(circleId as string) },
  })
  const [
    cancelRequest,
    { loading: cancelRequestLoading },
  ] = useCancelMemberRequestMutation({
    variables: { circleId: parseInt(circleId as string) },
  })

  if (loading) return null
  if (error) return <div>{error.message}</div>

  const handleSendRequest = async () => {
    try {
      await sendRequest({
        update: (cache, { data }) => {
          if (!data || !data.sendMemberRequest) return
          cache.writeQuery<IsMemberRequestExistsQuery>({
            variables: { circleId: parseInt(circleId as string) },
            query: IsMemberRequestExistsDocument,
            data: {
              isMemberRequestExists: data.sendMemberRequest,
            },
          })
        },
      })
      alert("Member request sent successfully")
    } catch (e) {
      console.log(e)
      alert(e.message)
    }
  }

  const handleCancelRequest = async () => {
    try {
      await cancelRequest({
        update: (cache, { data }) => {
          if (!data || !data.cancelMemberRequest) return
          cache.writeQuery<IsMemberRequestExistsQuery>({
            variables: { circleId: parseInt(circleId as string) },
            query: IsMemberRequestExistsDocument,
            data: {
              isMemberRequestExists: !data.cancelMemberRequest,
            },
          })
        },
      })
      alert("Member request cancelled successfully")
    } catch (e) {
      console.log(e)
      alert(e.message)
    }
  }

  return (
    <>
      {data.isMemberRequestExists ? (
        <button onClick={handleCancelRequest} disabled={cancelRequestLoading}>
          Cancel Member Request
        </button>
      ) : (
        <button onClick={handleSendRequest} disabled={sendRequsetLoading}>
          Send Member Request
        </button>
      )}
    </>
  )
}

export default MemberRequest
