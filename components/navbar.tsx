import Link from "next/link";
import { useRouter } from "next/router";
import { useRef } from "react";

import Cookies from "js-cookie";

import useAuthStore from "../store/authStore";
import axios from "axios";
import swal from "sweetalert2";

function Navbar() {
    const router = useRouter();
    const createPostBtnref = useRef(null);

    const useAuth = useAuthStore((state: any) => state.accessToken);
    const setAuthStore = useAuthStore((state: any) => state.setAccessToken);

    const logoutHandler = () => {
        axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/logout`,
            JSON.stringify({}),
            {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            }
        ).then((res) => {
            if (res.status !== 204) {
                swal.fire({
                    icon: 'error',
                    title: 'xdding?',
                    text: `Logout failed!`,
                }).then(() => {
                    return;
                })
            } else {
                swal.fire({
                    icon: 'success',
                    title: 'xdding?',
                    text: `Logout success!`,
                }).then(() => {
                });
            }
            setAuthStore(null);
            Cookies.set("u_id", "");
            window.location.href = "/";
        });
        //call logout api to delete cookie
    };

    return (
        <nav className="navbar-container">
            <div
                className="navbar-title"
                onClick={() => {
                    router.push({
                        pathname: '/',
                        query: { page: 1 },
                    });
                }}
            >
                MM16STUDIO
            </div>
            <div
                className="navbar-title_01"
                onClick={() => {
                    router.push({
                        pathname: '/',
                        query: { page: 1 },
                    });
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
