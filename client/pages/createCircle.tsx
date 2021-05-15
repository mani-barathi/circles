import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import {
  CustomError,
  useCreateCircleMutation,
  useMeQuery,
} from "../generated/graphql"

interface createCircleProps {}

const createCircle: React.FC<createCircleProps> = ({}) => {
  const { data: meData, loading: meLoading } = useMeQuery()
  const router = useRouter()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [err, setErr] = useState<CustomError[]>([])
  const [feedback, setFeedback] = useState(null)
  const [createCircle, { loading }] = useCreateCircleMutation()

  useEffect(() => {
    if (!meData) return
    if (!meData.me) {
      router.replace("/login?next=/createCircle")
    }
  }, [meData])

  if (meLoading) return <h3>Loading...</h3>
  if (!meData || !meData.me) return <h3>UnAuthorized</h3>

  const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = async (
    e
  ) => {
    e.preventDefault()
    setErr(null)
    const variables = { name, description }
    try {
      const { data } = await createCircle({
        variables,
      })
      if (data.createCircle.errors) {
        setErr(data.createCircle.errors)
      } else {
        setFeedback("circle created!")
        setName("")
        setDescription("")
        router.push(`/circle/${data.createCircle.circle?.id}`)
      }
    } catch (error) {
      alert(error)
      console.log(error)
    }
  }
  return (
    <div>
      <h2>New Circle</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Enter Circle Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <textarea
            cols={30}
            rows={5}
            placeholder="description (Optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-control"
          ></textarea>
        </div>

        {err?.map((error) => (
          <div className="alert alert-danger" key={error.message}>
            {error.message}
          </div>
        ))}

        {feedback && <div className="alert alert-success">{feedback}</div>}

        <button className="btn btn-primary" disabled={loading} type="submit">
          Create
        </button>
      </form>
    </div>
  )
}

export default createCircle
