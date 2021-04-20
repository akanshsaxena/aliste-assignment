import React, { useState, useEffect } from "react";
import axios from "axios";

import { useHistory } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isEmpty, setIsEmpty] = useState(false);
  const history = useHistory();

  useEffect(() => {
    localStorage.removeItem("accesstoken");
  });
  const handleChange = (e) => {
    if (e.target.name === "username") setUsername(e.target.value);
    else setPassword(e.target.value);
    setIsEmpty(false);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (username.length === 0 || password.length === 0) setIsEmpty(true);
    else {
      try {
        const params = JSON.stringify({
          username: username,
          password: password,
        });
        const response = await axios.post(
          "https://admin.alistetechnologies.com/auth/login",
          params,
          {
            headers: {
              "content-type": "application/json",
            },
          }
        );
        if (response.data.success) {
          history.push("/dashboard");
          localStorage.setItem("accesstoken", response.data.data.accesstoken);
          localStorage.setItem("user_name", response.data.data.details.name);
          localStorage.setItem("user_type", response.data.data.type);
        } else console.log("invalid creds");
      } catch (err) {
        console.log(err);
      }
    }
  };
  return (
    <div className="login">
      <h1 id="title">ALISTE TECHNOLOGIES</h1>
      <div className="form-container">
        <h2>LOGIN</h2>
        <div className="form">
          <form className="login-form">
            <label>
              <input
                className="login-input"
                type="text"
                value={username}
                onChange={handleChange}
                name="username"
                placeholder="Username"
                autoComplete="off"
              ></input>
            </label>
            <br />
            <label>
              <input
                className="login-input"
                type="password"
                value={password}
                onChange={handleChange}
                name="password"
                placeholder="Password"
              ></input>
            </label>
            <br />
            <button className="login-btn" onClick={handleClick}>
              LOG IN
            </button>
          </form>

          {isEmpty && (
            <p
              style={{
                color: "red",
                textAlign: "center",
                marginTop: "10px",
                fontWeight: "600",
              }}
            >
              * All fields are mandatory
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
