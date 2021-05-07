import React from "react"
import {
  IsMemberRequestExistsDocument,
  IsMemberRequestExistsQuery,
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
  if (loading) return null
  if (error) return <div>{error.message}</div>

  const handleSendRequest = async () => {
    try {
      const { errors } = await sendRequest({
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
      if (errors) {
        return alert(errors[0].message)
      }
      alert("Member request sent successfully")
    } catch (e) {
      console.log(e)
      alert(e)
    }
  }
  const handleCancelRequest = () => {}

  return (
    <>
      {data.isMemberRequestExists ? (
        <button onClick={handleCancelRequest}>Cancel Member Request</button>
      ) : (
        <button onClick={handleSendRequest} disabled={sendRequsetLoading}>
          Send Member Request
        </button>
      )}
    </>
  )
}

export default MemberRequest
