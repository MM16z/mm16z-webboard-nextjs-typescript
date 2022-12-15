import { FormEvent, useEffect, useRef, useState } from "react";
import axios from "axios";

import { useRouter } from "next/router";

import getUserauth from "../../hooks/getUserAuth";
import useAuthStore from "../../hooks/authstore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const useAuth = useAuthStore((state) => state.accessToken);

  const setAuthStore = useAuthStore((state) => state.setAccessToken);

  const routeAuth = () => {
    if (useAuth) {
      alert("already login");
      router.push("userpanel");
    }
  };

  const handleSubmit = (e: FormEvent<EventTarget | HTMLFormElement>) => {
    e.preventDefault();
    const jsonBodyData = {
      email: email,
      password: password,
    };
    axios
      .post("http://localhost:3006/login", JSON.stringify(jsonBodyData), {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.status === "error") {
          console.log(response.data);
          return alert("Login failed");
        }
        if (response.data.status === "ok") {
          setAuthStore(response.data.accessToken);
          alert("Login success");
          router.push("userpanel");
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
