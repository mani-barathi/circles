import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  MeDocument,
  MeQuery,
  useLoginMutation,
  useRegisterMutation,
} from "../generated/graphql";

interface loginProps {}

const login: React.FC<loginProps> = ({}) => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [loginUser, { loading: loginLoading }] = useLoginMutation();
  const [registerUser, { loading: registerLoading }] = useRegisterMutation();

  const clearFields = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setFeedback(null);
    setErr([]);
  };

  const toggleIsLogin = () => {
    clearFields();
    setIsLogin((prev) => !prev);
  };

  const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    isLogin ? handleLogin() : handleSignup();
  };

  const handleLogin = async () => {
    try {
      const { data, errors } = await loginUser({
        variables: { email, password },
        update: (cache, response) => {
          cache.writeQuery<MeQuery>({
            query: MeDocument,
            data: {
              __typename: "Query",
              me: response.data?.login?.user,
            },
          });
        },
      });
      if (errors) {
        console.log("handleSignup", errors);
        alert("somthing went wrong");
      } else {
        if (data.login?.user) {
          const path =
            typeof router.query.next === "string" ? router.query.next : "/";
          router.push(path);
        } else {
          setErr(data.login.errors);
          setPassword("");
        }
      }
    } catch (error) {
      console.log("handleLogin: ", error);
      alert(error);
    }
  };

  const handleSignup = async () => {
    setErr([]);
    try {
      const { data, errors } = await registerUser({
        variables: { username, email, password },
      });
      if (errors) {
        console.log("handleSignup", errors);
        alert("somthing went wrong");
      } else {
        if (data.register?.errors) {
          setErr(data.register.errors);
          setPassword("");
        } else {
          setFeedback(`Account created for ${data.register.user.username}`);
          clearFields();
          console.log(data.register.user);
        }
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div>
      <h1> {isLogin ? "Login" : "Sign Up"} </h1>

      <form onSubmit={handleFormSubmit}>
        {!isLogin && (
          <>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Username"
              minLength={3}
            />
            <br />
          </>
        )}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Email"
        />
        <br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Password"
        />
        <br />

        <div>
          {err.map((error) => (
            <h4 key={error.message}>{error.message}</h4>
          ))}
        </div>

        <div>{feedback && <h4>{feedback}</h4>}</div>

        <button
          disabled={isLogin ? loginLoading : registerLoading}
          type="submit"
        >
          {isLogin ? "Login" : "Submit"}
        </button>
      </form>

      <div className="item">
        <h4>
          {isLogin ? (
            <div>
              <span> New ? Create an Account</span> &nbsp;
              <button onClick={toggleIsLogin}>Here</button>
            </div>
          ) : (
            <div>
              <span>Already have an Account?</span> &nbsp;
              <button onClick={toggleIsLogin}>Login</button>
            </div>
          )}
        </h4>
      </div>
    </div>
  );
};

export default login;
