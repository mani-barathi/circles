import { useApolloClient } from "@apollo/client"
import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import {
  useMeQuery,
  useMessagesQuery,
  useNewMessageSubscription,
} from "../generated/graphql"
import ChatMessage from "./ChatMessage"

interface MessagesProps {
  circleId: number
}

const MESSAGES_LIMIT = 15

const Messages: React.FC<MessagesProps> = ({ circleId }) => {
  const client = useApolloClient()
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const prevScrollHeightRef = useRef<any>({})
  const scrollBottomRef = useRef<HTMLDivElement>(null)
  const [firstLoad, setFirstLoad] = useState(true)
  const [liveMessages, setLiveMessages] = useState<any[]>([])
  const { data: meData } = useMeQuery()
  const { data, loading, fetchMore } = useMessagesQuery({
    variables: { circleId },
    fetchPolicy: "network-only",
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
    if (!data) return
    if (firstLoad) {
      scrollBottomRef.current.scrollIntoView({ behavior: "smooth" })
      setFirstLoad(false)
    } else if (data.messages.data.length > MESSAGES_LIMIT) {
      const newScrollPos =
        chatContainerRef.current.scrollHeight -
        prevScrollHeightRef.current.scrollHeight
      chatContainerRef.current.scrollTop = newScrollPos
      chatContainerRef.current.scrollTo({
        top: newScrollPos,
        // behavior: "smooth",
      })
    }
  }, [data, firstLoad])

  useEffect(() => {
    if (!sData) return
    setLiveMessages((prev) => [...prev, sData.newMessage])
    if (sData.newMessage.authorId === meData.me.id) {
      scrollBottomRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [sData])

  if (!data || !data.messages) return null

  const handleLoadMore = async () => {
    prevScrollHeightRef.current = {
      scrollTop: chatContainerRef.current.scrollTop,
      scrollHeight: chatContainerRef.current.scrollHeight,
    }
    const cursor = data.messages.data[data.messages.data.length - 1].createdAt
    await fetchMore({ variables: { circleId, cursor } })
  }

  return (
    <div className="chat__container" ref={chatContainerRef}>
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
        style={{ padding: "1.5rem", margin: "1rem" }}
        ref={scrollBottomRef}
      ></div>
    </div>
  )
}

export default Messages
