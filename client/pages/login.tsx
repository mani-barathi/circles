import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import Spinner from "../components/Spinner"
import {
  MeDocument,
  MeQuery,
  useLoginMutation,
  useMeQuery,
  useRegisterMutation,
} from "../generated/graphql"

interface loginProps {}

const login: React.FC<loginProps> = ({}) => {
  const [loading, setLoading] = useState(true)
  const { data } = useMeQuery()
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [err, setErr] = useState<any[]>([])
  const [feedback, setFeedback] = useState(null)
  const [loginUser, { loading: loginLoading }] = useLoginMutation()
  const [registerUser, { loading: registerLoading }] = useRegisterMutation()

  useEffect(() => {
    if (!data) return
    if (data.me?.username) {
      router.replace("/")
    } else {
      setLoading(false)
    }
  }, [data])

  if (loading) {
    return <Spinner center={true} large={true} />
  }

  const clearFields = () => {
    setUsername("")
    setEmail("")
    setPassword("")
    setFeedback(null)
    setErr([])
  }

  const toggleIsLogin = () => {
    clearFields()
    setIsLogin((prev) => !prev)
  }

  const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    isLogin ? handleLogin() : handleSignup()
  }

  const handleLogin = async () => {
    try {
      const { data, errors } = await loginUser({
        variables: { email, password },
        update: (cache, response) => {
          if (!response.data || !response.data.login.user) return

          cache.writeQuery<MeQuery>({
            query: MeDocument,
            data: {
              __typename: "Query",
              me: response.data.login.user,
            },
          })
        },
      })

      if (errors) {
        console.log("handleSignup", errors)
        alert("somthing went wrong")
      } else {
        if (data.login?.user) {
          const path =
            typeof router.query.next === "string" ? router.query.next : "/"
          router.push(path)
        } else {
          setErr(data.login.errors)
          setPassword("")
        }
      }
    } catch (error) {
      console.log("handleLogin: ", error)
      alert(error)
    }
  }

  const handleSignup = async () => {
    setErr([])
    try {
      const { data } = await registerUser({
        variables: { username, email, password },
      })
      if (data) {
        if (data.register?.errors?.length > 0) {
          setErr(data.register.errors)
          setPassword("")
        }
        if (data.register?.user) {
          clearFields()
          setFeedback(`Account created for ${data.register?.user.username}`)
        }
      }
    } catch (e) {
      console.log("handleSignup: ", e)
      alert(e)
    }
  }

  return (
    <div className="app__window d-flex justify-content-center">
      <div style={{ width: "100%", maxWidth: "500px" }}>
        <h1 className="text-center mt-3"> {isLogin ? "Login" : "Sign Up"} </h1>

        <form onSubmit={handleFormSubmit} className="mt-4 w-100">
          {!isLogin && (
            <div className="form-group">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Username"
                minLength={3}
                className="form-control"
              />
            </div>
          )}
          <div className="form-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-control"
              placeholder="Password"
            />
          </div>

          {err.map((error) => (
            <div className="alert alert-danger" key={error.message}>
              {error.message}
            </div>
          ))}

          {feedback && <div className="alert alert-success">{feedback}</div>}

          <button
            disabled={isLogin ? loginLoading : registerLoading}
            type="submit"
            className="btn btn-primary"
          >
            {(loginLoading || registerLoading) && (
              <span className="spinner-border spinner-border-sm mr-2"></span>
            )}
            {isLogin ? "Login" : "Submit"}
          </button>
        </form>

        <div className="">
          {isLogin ? (
            <div>
              <span> New ? Create an Account</span> &nbsp;
              <button
                onClick={toggleIsLogin}
                className="btn btn-sm btn-secondary"
              >
                Here
              </button>
            </div>
          ) : (
            <div>
              <span>Already have an Account?</span> &nbsp;
              <button
                onClick={toggleIsLogin}
                className="btn btn-sm btn-secondary"
              >
                Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default login
