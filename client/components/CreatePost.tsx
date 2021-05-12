import React, { useState } from "react"

interface CreatePostProps {
  circleId: number
}

const CreatePost: React.FC<CreatePostProps> = ({ circleId }) => {
  const [text, setText] = useState("")

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    console.log(circleId, text)
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        cols={30}
        rows={5}
        onChange={(e) => setText(e.target.value)}
        value={text}
      ></textarea>
    </form>
  )
}

export default CreatePost
