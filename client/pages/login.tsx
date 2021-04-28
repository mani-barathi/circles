import React, { useState } from "react";

interface loginProps {}

const login: React.FC<loginProps> = ({}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [feedback, setFeedback] = useState(null);

  const clearFields = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setFeedback(null);
    setErrors([]);
  };

  const toggleIsLogin = () => {
    clearFields();
    setIsLogin((prev) => !prev);
  };
  const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (isLogin) {
      handleLogin();
    } else {
      handleSignup();
    }
  };

  const handleLogin = async () => {
    console.log(`login`);
  };

  const handleSignup = async () => {
    console.log(`signup`);
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
          {errors.map((error) => (
            <h5 className="red-color" key={error.message}>
              {error.message}
            </h5>
          ))}
        </div>

        <div>{feedback && <h5 className="green-color">{feedback}</h5>}</div>

        <button type="submit">{isLogin ? "Login" : "Submit"}</button>
      </form>

      <div className="item">
        <h4>
          {isLogin ? (
            <>
              <span> New ? Create an Account</span> &nbsp;
              <button onClick={toggleIsLogin}> Here </button>
            </>
          ) : (
            <>
              <span>Already have an Account?</span> &nbsp;
              <button onClick={toggleIsLogin}> Login </button>
            </>
          )}
        </h4>
      </div>
    </div>
  );
};

export default login;
