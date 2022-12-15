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

//module css later for not messing on same css attb

import { createContext, useRef } from "react";

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
      </div>
    </Appcontext.Provider>
  );
}

export default MyApp;
