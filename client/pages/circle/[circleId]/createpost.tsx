import { useRouter } from "next/router"
import React, { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import CircleNavigation from "../../../components/CircleNavigation"
import PageNotFound from "../../../components/PageNotFound"
import Spinner from "../../../components/Spinner"
import {
  useCircleQuery,
  useCreatePostMutation,
} from "../../../generated/graphql"

interface createpostProps {}

const createpost: React.FC<createpostProps> = ({}) => {
  const router = useRouter()
  const [text, setText] = useState("")
  const [image, setImage] = useState<any>(null)
  const [errors, setErrors] = useState([])
  const [createPost, { loading }] = useCreatePostMutation()
  const circleId =
    typeof router.query.circleId === "string"
      ? parseInt(router.query.circleId)
      : null

  const {
    data: circleData,
    loading: circleLoading,
    error: circleError,
  } = useCircleQuery({
    variables: { circleId },
    skip: typeof circleId !== "number",
  })

  const onDrop = useCallback((acceptedFiles) => {
    setErrors([])
    if (acceptedFiles.length > 1) {
      return setErrors([{ message: "you can upload only one image" }])
    }
    const uploadedFile = acceptedFiles[0]
    if (!uploadedFile.type.startsWith("image")) {
      return setErrors([{ message: "file should be an image" }])
    }

    if (uploadedFile.size > 2500000) {
      return setErrors([{ message: "image size should be less than 2.5Mb" }])
    }
    setImage(uploadedFile)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  if (circleLoading) return <Spinner center={true} large={true} />
  if (circleError) return <PageNotFound />

  if (!circleData) return null
  if (!circleData?.circle.isMember) return <PageNotFound />

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    setErrors([])
    try {
      await createPost({
        variables: { circleId, text, image },
      })
      router.push(`/circle/${circleId}/`)
    } catch (e) {
      console.log(e.message)
      setErrors([e])
    }
  }

  const handleRemoveImage: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setImage(null)
  }

  return (
    <div className="app__window">
      <h1>{circleData.circle.name}</h1>
      <CircleNavigation circleId={circleId} section="createpost" />

      <form onSubmit={handleSubmit} className="mt-3">
        {/* React Dropzone */}
        <div
          {...getRootProps()}
          className="alert p-3 mb-2 border rounded text-center"
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <div className="py-3">Drop the files here ...</div>
          ) : (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ cursor: "default" }}
            >
              {image ? (
                <>
                  <span className="mr-2 mt-1">{image.name}</span>
                  <button
                    onClick={handleRemoveImage}
                    type="button"
                    className="close p-0"
                    aria-label="Close"
                    title="remove image"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </>
              ) : (
                `Drag 'n' drop an image here, or click to select an image`
              )}
            </div>
          )}
        </div>

        {errors.map((e) => (
          <div className="alert alert-danger mt-1 mb-2" key={e.message}>
            {e.message}
          </div>
        ))}

        <textarea
          className="form-control"
          rows={3}
          onChange={(e) => setText(e.target.value)}
          value={text}
          maxLength={280}
          required
          placeholder="Type something"
        ></textarea>
        <div>
          <button
            className="btn btn-primary mt-1 float-left"
            disabled={loading}
            type="submit"
          >
            {loading && (
              <span className="spinner-border spinner-border-sm mr-2"></span>
            )}
            {loading ? "Submitting..." : "Submit"}
          </button>
          <span
            className={`font-weight-bold float-right ${
              text.length > 280 ? "text-danger" : "text-muted"
            }`}
          >
            {text.length}/280
          </span>
        </div>
      </form>
    </div>
  )
}

export default createpost
