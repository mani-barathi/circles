import { useApolloClient } from "@apollo/client"
import React, { useEffect, useState, useRef, useLayoutEffect } from "react"
import {
  Message,
  NewMessageDocument,
  NewMessageSubscription,
  useMeQuery,
  useMessagesQuery,
  useNewMessageSubscription,
} from "../generated/graphql"
import ChatMessage from "./ChatMessage"

interface MessagesProps {
  circleId: number
}

const Messages: React.FC<MessagesProps> = ({ circleId }) => {
  const client = useApolloClient()
  const [firstLoad, setFirstLoad] = useState(true)
  const scrollBottomRef = useRef<HTMLDivElement>(null)
  const [liveMessages, setLiveMessages] = useState<any[]>([])
  const { data: meData } = useMeQuery()
  const { data, loading, fetchMore } = useMessagesQuery({
    variables: { circleId },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
  })
  const { loading: sLoading, data: sData } = useNewMessageSubscription({
    variables: { circleId },
  })

  useLayoutEffect(() => {
    client.cache.evict({ fieldName: "messages" })
    client.cache.evict({ fieldName: "newMessage", id: "ROOT_SUBSCRIPTION" })
    client.cache.gc()
  }, [])

  useEffect(() => {
    if (loading || !data || !firstLoad) return
    scrollBottomRef.current.scrollIntoView({ behavior: "smooth" })
    setFirstLoad(false)
  }, [data, loading])

  useEffect(() => {
    if (sLoading) return console.log("sLoading....")
    if (sData) {
      setLiveMessages((prev) => [...prev, sData.newMessage])
      // if (sData.newMessage.authorId === meData.me.id) {
      scrollBottomRef.current.scrollIntoView({ behavior: "smooth" })
      // }
    }
  }, [sData, sLoading])

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
          <ChatMessage
            key={message.id}
            message={message}
            isMine={meData.me.id === message.authorId}
          />
        ))}

      {/* Live Messages */}
      {liveMessages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
          isMine={meData.me.id === message.authorId}
        />
      ))}

      <div
        style={{ padding: "1rem", margin: "1rem" }}
        ref={scrollBottomRef}
      ></div>
    </div>
  )
}

export default Messages
