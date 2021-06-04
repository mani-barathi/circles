import React, { forwardRef } from "react"
import { Message, User } from "../generated/graphql"
import { formatTime } from "../utils/formatTime"

interface MessageProps {
  message: {
    __typename?: "Message"
  } & Pick<Message, "text" | "id" | "authorId" | "circleId" | "createdAt"> & {
      author?: {
        __typename?: "User"
      } & Pick<User, "id" | "username">
    }
  isMine: Boolean
}

function ChatMessage({ isMine, message }: MessageProps) {
  return (
    <div
      className={`mb-1 border py-1 px-2 shadow-sm chatmessage ${
        isMine ? "ml-auto bg-light" : "bg-white"
      }`}
    >
      {!isMine && (
        <small className="mr-2 font-weight-bold d-block">
          {message.author.username}
        </small>
      )}
      <div>
        <p className="m-0">{message.text}</p>
        <small
          className={`ml-3 text-right d-block text-muted`}
          style={{ fontSize: "0.65rem" }}
        >
          {formatTime(message.createdAt)}
        </small>
      </div>
    </div>
  )
}

export default ChatMessage
