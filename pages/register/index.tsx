import { FormEvent, useEffect, useRef, useState } from "react";
import axios from "axios";

import useAuthStore from "../../global_state/authStore";

import { useRouter } from "next/router";

import { Blocks } from "react-loader-spinner";

const Register = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isloading, setIsLoading] = useState(false);

  const useAuth = useAuthStore((state) => state.accessToken);

  const routeAuth = () => {
    if (useAuth) {
      // alert("already login");
      router.push("userpanel");
    }
  };

  const loadingRegister = isloading ? (
    <Blocks
      visible={true}
      height="280"
      width="280"
      ariaLabel="blocks-loading"
      wrapperStyle={{}}
      wrapperClass="blocks-wrapper"
    />
  ) : null;

  const onRegisterSubmitHandler = (
    e: FormEvent<EventTarget | HTMLFormElement>
  ) => {
    e.preventDefault();
    setIsLoading(true);
    const payloadData = {
      username: username,
      email: email,
      password: password,
    };

    axios
      .post(
        "https://good-puce-squirrel-wear.cyclic.app/register",
        JSON.stringify(payloadData),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setIsLoading(false);
        if (response.data.message.errno === 1062) {
          return alert("Email already used");
        }
        if (response.data.status === "error") {
          return alert("Register failed");
        }
        if (response.data.status === "ok") {
          alert("Register Success");
          router.push("login");
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
  }, [useAuth]);

  return (
    <div className="register-page-container">
      {loadingRegister}
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
