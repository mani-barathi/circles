import React, { useState } from "react";
import { useLoginMutation, useRegisterMutation } from "../generated/graphql";

interface loginProps {}

const login: React.FC<loginProps> = ({}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [loginUser] = useLoginMutation();
  const [registerUser] = useRegisterMutation();

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
      });
      if (errors) {
        console.log("handleSignup", errors);
        alert("somthing went wrong");
      } else {
        if (data.login?.errors) {
          setErr(data.login.errors);
          setPassword("");
        } else {
          console.log(data.login.user);
        }
      }
    } catch (error) {
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
          console.log(data.register.user);
        }
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div style={{ padding: "0 1rem" }}>
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

        <button type="submit">{isLogin ? "Login" : "Submit"}</button>
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
