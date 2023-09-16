import Image from "next/image";
import { forwardRef, useContext, useImperativeHandle, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/router";

import mm16grid from "../assets/images/mm16grid.png";
import { Appcontext } from "../pages/_app";
import useAuthStore from "../store/authStore";

import Cookies from "js-cookie";

const Mobilemenu = forwardRef((probs, refs) => {
  const mobilemenuref = useRef<HTMLDivElement>(null);

  const useAuth = useAuthStore((state) => state.accessToken);

  const setAuthStore = useAuthStore((state) => state.setAccessToken);

  useImperativeHandle(refs, () => mobilemenuref.current);
  const router = useRouter();
  const appcontext = useContext(Appcontext);

  return (
    <div className="mobilemenu" ref={mobilemenuref}>
      {router.pathname === "/userpanel" ? null : (
        <p
          onClick={() => {
            if (useAuth) {
              router.push("userpanel");
              mobilemenuref.current?.classList.toggle("active");
              appcontext.current.classList.toggle("active");
            } else {
              router.push("login");
              mobilemenuref.current?.classList.toggle("active");
              appcontext.current.classList.toggle("active");
            }
          }}
        >
          Createpost
        </p>
      )}
      {router.pathname === "/userpanel" || useAuth ? null : (
        <p
          style={{ top: "150px" }}
          onClick={() => {
            router.push("/login");
            mobilemenuref.current?.classList.toggle("active");
            appcontext.current.classList.toggle("active");
          }}
        >
          LOGIN
        </p>
      )}
      {router.pathname === "/userpanel" || useAuth ? null : (
        <p
          style={{ top: "250px" }}
          onClick={() => {
            router.push("/register");
            mobilemenuref.current?.classList.toggle("active");
            appcontext.current.classList.toggle("active");
          }}
        >
          REGISTER
        </p>
      )}
      {useAuth ? (
        <p
          style={{ top: "150px" }}
          onClick={() => {
            axios.post(
              `${process.env.NEXT_PUBLIC_API_URL}/logout`,
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
            mobilemenuref.current?.classList.toggle("active");
            appcontext.current.classList.toggle("active");
            window.location.href = "/";
          }}
        >
          LOGOUT
        </p>
      ) : null}
      <div className="image-warper">
        <Image src={mm16grid} layout="fixed" alt=""></Image>
      </div>
    </div>
  );
});
Mobilemenu.displayName = "MobileMenu";
export default Mobilemenu;
