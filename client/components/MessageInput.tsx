import React, { useState } from "react"
import { useMeQuery, useSendMessageMutation } from "../generated/graphql"

interface MessageInputProps {
  circleId: number
}

const MessageInput: React.FC<MessageInputProps> = ({ circleId }) => {
  const { data: meData } = useMeQuery()
  const [text, setText] = useState("")
  const [sendMessage, { loading }] = useSendMessageMutation()

  const handleSendMessage: React.FormEventHandler<HTMLFormElement> = async (
    e
  ) => {
    e.preventDefault()
    const { username } = meData.me
    if (!text || !username) return

    try {
      await sendMessage({ variables: { circleId, text, username } })
      setText("")
    } catch (e) {
      console.log(e.message)
      alert(e.message)
    }
  }
  return (
    <form
      onSubmit={handleSendMessage}
      className="d-flex mt-2 mb-2 w-100 px-2"
      style={{ maxWidth: "1000px" }}
    >
      <input
        type="text"
        className="form-control flex-grow-1"
        placeholder="Type a message"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button className="btn btn-info ml-2">Send</button>
    </form>
  )
}

export default MessageInput
