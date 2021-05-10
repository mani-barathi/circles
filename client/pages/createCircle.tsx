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
        setErr([{ path: "succes", message: "circle created!" }])
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
      <h1>New Circle</h1>
      <form onSubmit={handleFormSubmit}>
        <div>
          <input
            type="text"
            placeholder="Enter Circle Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <textarea
            cols={30}
            rows={5}
            placeholder="description (Optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div>
          {err?.map((error) => (
            <h4 key={error.message}>{error.message}</h4>
          ))}
        </div>
        <button disabled={loading} type="submit">
          Create
        </button>
      </form>
    </div>
  )
}

export default createCircle
