import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { setCookie } from "cookies-next";

function Navbar() {
  const [currentToken, setCurrentToken] = useState({
    token: null as any,
  });
  const router = useRouter();
  const createPostBtnref = useRef(null);

  const getLocalStorageItem = (key: string) => {
    return typeof window !== undefined
      ? window.localStorage.getItem(key)
      : null;
  };
  const logoutHandler = () => {
    setCurrentToken({
      token: window.localStorage.removeItem("token"),
    });
    setCookie("userId", null);
    window.location.href = "/";
  };

  useEffect(() => {
    setCurrentToken({
      token: getLocalStorageItem("token"),
    });
  }, []);
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
      {currentToken.token ? null : (
        <Link href="/login" className={"navbar-text-login"}>
          {/* <div className={"navbar-text-login"}>Login</div> */}
          Login
        </Link>
      )}
      {currentToken.token ? null : (
        <Link href="/register" className={"navbar-text-register"}>
          {/* <div className={"navbar-text-register"}>Register |</div> */}
          Register |
        </Link>
      )}
      {router.pathname === "/userpanel" ? null : (
        <div
          ref={createPostBtnref}
          className={
            currentToken.token
              ? "navbar-text-createpost_isLogin"
              : "navbar-text-createpost"
          }
          onClick={() => {
            window.location.href = "/userpanel";
          }}
          style={{ right: currentToken.token ? "140px" : "295px" }}
        >
          CreatePost |
        </div>
      )}
      {currentToken.token ? (
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
