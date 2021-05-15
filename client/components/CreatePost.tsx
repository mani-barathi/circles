import React, { useState } from "react"
import {
  PostsDocument,
  PostsQuery,
  useMeQuery,
  useCreatePostMutation,
} from "../generated/graphql"

interface CreatePostProps {
  circleId: number
}

const CreatePost: React.FC<CreatePostProps> = ({ circleId }) => {
  const { data: meData } = useMeQuery()
  const [text, setText] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [errors, setErrors] = useState([])
  const [createPost, { loading }] = useCreatePostMutation()

  const handleOpen = () => setIsOpen(true)
  const handleClose = () => {
    setErrors([])
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <button className="btn btn-info btn-sm mt-1" onClick={handleOpen}>
        Create Post
      </button>
    )
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    try {
      const { data } = await createPost({
        variables: { circleId, text },
        // refetchQueries: [{ query: PostsDocument, variables: { circleId } }],
        update: (cache, { data }) => {
          if (!data || !data.createPost) return
          const previousPosts = cache.readQuery<PostsQuery>({
            query: PostsDocument,
            variables: { circleId },
          })

          cache.writeQuery<PostsQuery>({
            query: PostsDocument,
            variables: { circleId },
            data: {
              posts: {
                ...previousPosts.posts,
                data: [
                  {
                    ...data.createPost,
                    hasLiked: false,
                    likesCount: 0,
                    creator: {
                      ...meData.me,
                    },
                  },
                ],
              },
            }, // end of data
          }) // end of writeQuery
        },
      })
      console.log(data)
      setText("")
      alert("Post created!")
      setIsOpen(false)
    } catch (e) {
      console.log(e.message)
      setErrors([e])
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-1">
      <textarea
        className="form-control"
        rows={5}
        onChange={(e) => setText(e.target.value)}
        value={text}
        placeholder="Type something"
      ></textarea>
      {errors.map((e) => (
        <h4 key={e.message}>{e.message}</h4>
      ))}
      <button
        className="btn btn-secondary btn-sm mt-1"
        type="button"
        onClick={handleClose}
      >
        Cancel
      </button>
      <button
        className="btn btn-primary ml-2 btn-sm mt-1"
        disabled={loading}
        type="submit"
      >
        Submit
      </button>
    </form>
  )
}

export default CreatePost
