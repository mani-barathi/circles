import React from "react"
import { useMeQuery, useMessagesQuery } from "../generated/graphql"
import Message from "./Message"

interface MessagesProps {
  circleId: number
}

const Messages: React.FC<MessagesProps> = ({ circleId }) => {
  const { data: meData } = useMeQuery()
  const { data, loading, error, fetchMore } = useMessagesQuery({
    variables: { circleId },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
  })
  if (!data || !data.messages) return null

  const handleLoadMore = async () => {
    const cursor = data.messages.data[data.messages.data.length - 1].createdAt
    await fetchMore({ variables: { circleId, cursor } })
  }

  return (
    <div className="chat__container">
      {data.messages.hasMore && (
        <div>
          <button
            onClick={handleLoadMore}
            className="mb-2 btn btn-secondary btn-sm"
            disabled={loading}
          >
            {loading && (
              <span className="spinner-border spinner-border-sm mr-2"></span>
            )}
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      {data.messages.data
        .slice()
        .reverse()
        .map((message) => (
          <Message
            key={message.id}
            message={message}
            isMine={meData.me.id === message.authorId}
          />
        ))}
    </div>
  )
}

export default Messages
