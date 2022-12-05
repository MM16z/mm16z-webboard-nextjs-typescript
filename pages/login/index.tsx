import { FormEvent, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

import hasJWT from "../../jwt_auth/hasJWT";
import getUserauth from "../../jwt_auth/getUserAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const routeAuth = () => {
    if (hasJWT()) {
      getUserauth().then((response) => {
        if (response.data.status === "error") {
          localStorage.removeItem("token");
          window.location.href = "/";
        } else {
          router.push("/userpanel");
        }
      });
      alert("already login");
      alert("dont broke my Pepehands code :(");
    }
  };

  const handleSubmit = (e: FormEvent<EventTarget | HTMLFormElement>) => {
    e.preventDefault();
    const jsonBodyData = {
      email: email,
      password: password,
    };
    axios
      .post(
        "https://blushing-gold-macaw.cyclic.app/login",
        JSON.stringify(jsonBodyData),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (response.data.status === "ok") {
          alert("Login success");
          localStorage.setItem("token", response.data.token);
          window.location.href = "/userpanel";
        } else {
          alert("login failed");
        }
      })
      .catch((error) => {
        console.log("Error", error);
      });
    setEmail("");
    setPassword("");
  };

  useEffect(() => {
    routeAuth();
    emailRef.current?.focus();
  }, []);

  return (
    <div className="login-page-container">
      <form method="post" onSubmit={handleSubmit}>
        <div className="login-inputcontainer">
          <label htmlFor="email-input">Enter your email :D</label>
          <input
            className="inputborder"
            id="email-input"
            type="email"
            ref={emailRef}
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          ></input>
          <label htmlFor="password-input">Enter your password :V</label>
          <input
            className="inputborder"
            id="password-input"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          ></input>
          <div
            id="toregisref"
            onClick={() => {
              router.push("register");
            }}
          >
            Don't have an account?
          </div>
          <input id="login-submitbtn" type="submit" value="Login"></input>
        </div>
      </form>
      <div id="home-page-bg">
        <span id="home-page-bg-nested"></span>
      </div>
    </div>
  );
};

export default Login;
