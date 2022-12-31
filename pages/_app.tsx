import "../styles/_app.scss";
import "../styles/pages_style/home.scss";
import "../styles/pages_style/login.scss";
import "../styles/pages_style/register.scss";
import "../styles/pages_style/userpanel.scss";

import "../styles/components_style/navbar.scss";
import "../styles/components_style/post-box-container.scss";
import "../styles/components_style/hambergermenu.scss";
import "../styles/components_style/comment-box-container.scss";
import "../styles/components_style/heartbtn.scss";

import githubMark from "../assets/images/GitHub-Mark.png";

//module css later for not messing on same css attb

import { createContext, useRef } from "react";

import Image from "next/image";

import Navbar from "../components/navbar";
import Hambergermenu from "../components/hambergermenu";
import Mobilemenu from "../components/mobilemenu";

import NProgress from "nprogress";
import "nprogress/nprogress.css";

import type { AppProps } from "next/app";
import Router from "next/router";

//alredy has global state(zustand) => will change later
export const Appcontext = createContext({} as any);

function MyApp({ Component, pageProps }: AppProps) {
  const mobilemenuref = useRef<HTMLDivElement>(null);
  const hambergermenuref = useRef<SVGSVGElement>(null);

  NProgress.configure({
    minimum: 0.3,
    easing: "ease",
    speed: 800,
    showSpinner: true,
  });

  Router.events.on("routeChangeStart", () => NProgress.start());
  Router.events.on("routeChangeComplete", () => NProgress.done());
  Router.events.on("routeChangeError", () => NProgress.done());

  const onHambergerMenuClick = () => {
    hambergermenuref.current?.classList.toggle("active");
    mobilemenuref.current?.classList.toggle("active");
  };

  return (
    <Appcontext.Provider value={hambergermenuref}>
      <div className="_app">
        <Navbar />
        <Hambergermenu ref={hambergermenuref} onClick={onHambergerMenuClick} />
        <Mobilemenu ref={mobilemenuref} />
        <Component {...pageProps} />
        <Image
          src={githubMark}
          alt=""
          id="githubmark"
          onClick={() => {
            window.open(
              "https://github.com/MM16z/mm16z-webboard-nextjs-typescript",
              "_blank"
            );
          }}
        ></Image>
        <div className="mm16z">©2022 MM16 | All Rights Reserved</div>
      </div>
    </Appcontext.Provider>
  );
}

export default MyApp;
