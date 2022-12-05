import "../assets/style/_app.scss";
import "../assets/style/pages_style/home.scss";
import "../assets/style/pages_style/login.scss";
import "../assets/style/pages_style/register.scss";
import "../assets/style/pages_style/userpanel.scss";

import "../assets/style/components_style/navbar.scss";
import "../assets/style/components_style/post-box-container.scss";
import "../assets/style/components_style/hambergermenu.scss";
import "../assets/style/components_style/comment-box-container.scss";
import "../assets/style/components_style/heartbtn.scss";
import "../assets/style/components_style/mobilemenu.scss";

import Navbar from "../components/navbar";
import Hambergermenu from "../components/hambergermenu";
import Mobilemenu from "../components/mobilemenu";
import { createContext, useRef } from "react";

import type { AppProps } from "next/app";

export const Appcontext = createContext({} as any);

function MyApp({ Component, pageProps }: AppProps) {
  const mobilemenuref = useRef<HTMLDivElement>(null);
  const hambergermenuref = useRef<SVGSVGElement>(null);

  return (
    <Appcontext.Provider value={hambergermenuref}>
      <div className="_app">
        <Navbar />
        <Hambergermenu
          ref={hambergermenuref}
          onClick={() => {
            hambergermenuref.current?.classList.toggle("active");
            mobilemenuref.current?.classList.toggle("active");
          }}
        />
        <Mobilemenu ref={mobilemenuref} />
        <Component {...pageProps} />
      </div>
    </Appcontext.Provider>
  );
}

export default MyApp;
