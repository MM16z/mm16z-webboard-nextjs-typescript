import Link from "next/link";
import { useRouter } from "next/router";
import { useRef } from "react";

import Cookies from "js-cookie";

import useAuthStore from "../state/authStore";
import axios from "axios";

function Navbar() {
  const router = useRouter();
  const createPostBtnref = useRef(null);

  const useAuth = useAuthStore((state) => state.accessToken);
  const setAuthStore = useAuthStore((state) => state.setAccessToken);

  const logoutHandler = () => {
    axios.post(
      "https://good-puce-squirrel-wear.cyclic.app/logout",
      JSON.stringify({}),
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    setAuthStore(null);
    Cookies.set("u_id", "");
    //call logout api to delete cookie
    router.push("/");
    router.reload();
  };

  return (
    <nav className="navbar-container">
      <div
        className="navbar-title"
        onClick={() => {
          router.push("/");
        }}
      >
        MM16STUDIO
      </div>
      <div
        className="navbar-title_01"
        onClick={() => {
          router.push("/");
        }}
      >
        Webboard
      </div>
      {useAuth ? null : (
        <Link href="/login" className={"navbar-text-login"}>
          Login
        </Link>
      )}
      {useAuth ? null : (
        <Link href="/register" className={"navbar-text-register"}>
          Register |
        </Link>
      )}
      {router.pathname === "/userpanel" ? null : (
        <div
          ref={createPostBtnref}
          className={
            useAuth
              ? "navbar-text-createpost_isLogin"
              : "navbar-text-createpost"
          }
          onClick={() => {
            if (useAuth) {
              router.push("userpanel");
            } else {
              router.push("login");
            }
          }}
          style={{ right: useAuth ? "140px" : "295px" }}
        >
          CreatePost |
        </div>
      )}
      {useAuth ? (
        <div className="navbar-text-logout" onClick={logoutHandler}>
          Logout
        </div>
      ) : null}
      <span className="navbar-bg">
        <span className="navbar-bg-nested"></span>
      </span>
    </nav>
  );
}

export default Navbar;
