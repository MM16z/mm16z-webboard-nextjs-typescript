import Image from "next/image";
import {
  ForwardedRef,
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/router";

import getUserauth from "../jwt_auth/getUserAuth";

import mm16grid from "../assets/images/mm16grid.png";
import { Appcontext } from "../pages/_app";

const Mobilemenu = forwardRef((probs, refs) => {
  const mobilemenuref = useRef<HTMLDivElement>(null);
  useImperativeHandle(refs, () => mobilemenuref.current);
  const router = useRouter();
  const appcontext = useContext(Appcontext);
  const [currentToken, setCurrentToken] = useState({ token: null as any });

  const getLocalStorageItem = (key: string) => {
    return typeof window !== undefined
      ? window.localStorage.getItem(key)
      : null;
  };

  const routeAuth = () => {
    if (currentToken.token) {
      getUserauth().then((result) => {
        if (result.data.status === "error") {
          localStorage.clear();
          window.location.href = "/";
        }
      });
    }
  };

  useEffect(() => {
    routeAuth();
    setCurrentToken({
      token: getLocalStorageItem("token"),
    });
    console.log(appcontext);
  }, []);
  return (
    <div className="mobilemenu" ref={mobilemenuref}>
      {router.pathname === "/userpanel" ? null : (
        <p
          onClick={() => {
            window.location.href = "/userpanel";
          }}
        >
          Createpost
        </p>
      )}

      {router.pathname === "/userpanel" || currentToken.token ? null : (
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
      {router.pathname === "/userpanel" || currentToken.token ? null : (
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
      {currentToken.token ? (
        <p
          style={{ top: "150px" }}
          onClick={() => {
            setCurrentToken({
              token: localStorage.removeItem("token"),
            });
            window.location.href = "/";
            mobilemenuref.current?.classList.toggle("active");
            appcontext.current.classList.toggle("active");
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
