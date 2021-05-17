import React from "react"
import { Message, User } from "../generated/graphql"

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

const ChatMessage: React.FC<MessageProps> = ({ message, isMine }) => {
  return (
    <div
      className={`mb-1 border py-1 px-2 shadow-sm ${
        isMine ? "ml-auto bg-light" : "bg-white"
      }`}
      style={style}
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

const style: React.CSSProperties = {
  width: "fit-content",
  minWidth: "10%",
  maxWidth: "80%",
  borderRadius: "0.5rem",
}

const formatTime = (time: string): string => {
  const dObj = new Date(parseInt(time))
  const t = dObj.toLocaleTimeString().split(" ")
  const date = dObj.toDateString().split(" ")
  const period = t[1]
  const temp = t[0].split(":", 2)
  return `${date[0]} ${date[1]} ${date[2]} ${temp[0]}:${temp[1]} ${period}`
}
