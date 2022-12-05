import { FormEvent, useEffect, useRef, useState } from "react";
import axios from "axios";

import hasJWT from "../../jwt_auth/hasJWT";
import getUserauth from "../../jwt_auth/getUserAuth";
import { useRouter } from "next/router";

const Register = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const routeAuth = () => {
    if (hasJWT()) {
      getUserauth().then((response) => {
        if (response.data.status === "error") {
          localStorage.removeItem("token");
          window.location.href = "/";
        } else {
          window.location.href = "/userpanel";
        }
      });
      alert("already login");
      alert("dont broke my Pepehands code :(");
    }
  };

  const onRegisterSubmitHandler = (
    e: FormEvent<EventTarget | HTMLFormElement>
  ) => {
    e.preventDefault();
    const jsonBodydata = {
      username: username,
      email: email,
      password: password,
    };

    axios
      .post(
        "https://blushing-gold-macaw.cyclic.app/register",
        JSON.stringify(jsonBodydata),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (response.data.status === "ok") {
          alert("Register Success");
          router.push("login");
        } else {
          alert("Register failed");
        }
      })
      .catch((error) => {
        console.log("Error", error);
      });

    setUsername("");
    setEmail("");
    setPassword("");
  };

  useEffect(() => {
    routeAuth();
    emailRef.current?.focus();
  }, []);

  return (
    <div className="register-page-container">
      <form method="post" onSubmit={onRegisterSubmitHandler}>
        <div className="register-inputcontainer">
          <label htmlFor="email-input">Enter your email</label>
          <input
            className="inputborder"
            id="email-input"
            type="email"
            name="email"
            ref={emailRef}
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          ></input>
          <label htmlFor="password-input">Enter your password</label>
          <input
            className="inputborder"
            id="password-input"
            type="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          ></input>
          <label htmlFor="username-input" id="username-input-label">
            Enter your Username
          </label>
          <input
            className="inputborder"
            id="username-input"
            type="text"
            name="username"
            ref={usernameRef}
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            required
          ></input>
          <input id="register-submitbtn" type="submit" value="register"></input>
        </div>
      </form>
      <div id="home-page-bg">
        <span id="home-page-bg-nested"></span>
      </div>
    </div>
  );
};

export default Register;
