import React, { useState } from "react"
import { useCreatePostMutation } from "../generated/graphql"

interface CreatePostProps {
  circleId: number
}

const CreatePost: React.FC<CreatePostProps> = ({ circleId }) => {
  const [text, setText] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [createPost, { loading }] = useCreatePostMutation()

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    try {
      const { data } = await createPost({ variables: { circleId, text } })
      console.log(data)
      setText("")
      alert("Post created!")
      setIsOpen(false)
    } catch (e) {
      console.log(e.message)
      alert(e.message)
    }
  }

  if (!isOpen) {
    return <button onClick={() => setIsOpen((p) => !p)}>Create Post</button>
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        cols={30}
        rows={5}
        onChange={(e) => setText(e.target.value)}
        value={text}
        required
        placeholder="Type something"
      ></textarea>
      <br />
      <button type="button" onClick={() => setIsOpen(false)}>
        Cancel
      </button>
      &nbsp; &nbsp;
      <button disabled={loading} type="submit">
        Submit
      </button>
    </form>
  )
}

export default CreatePost
