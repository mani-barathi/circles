import React, { useState } from "react"
import { useSendMessageMutation } from "../generated/graphql"

interface MessageInputProps {
  circleId: number
}

const MessageInput: React.FC<MessageInputProps> = ({ circleId }) => {
  const [text, setText] = useState("")
  const [sendMessage, { loading }] = useSendMessageMutation()

  const handleSendMessage: React.FormEventHandler<HTMLFormElement> = async (
    e
  ) => {
    e.preventDefault()
    if (!text) return

    try {
      await sendMessage({ variables: { circleId, text } })
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
