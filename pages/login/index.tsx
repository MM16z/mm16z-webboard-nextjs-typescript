import { FormEvent, useEffect, useRef, useState } from "react";
import axios from "axios";

import { useRouter } from "next/router";

import useAuthStore from "../../store/authStore";

import { Blocks } from "react-loader-spinner";
import swal from "sweetalert2";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isloading, setIsLoading] = useState(false);

    const emailRef = useRef<HTMLInputElement>(null);

    const router = useRouter();

    const useAuth = useAuthStore((state) => state.accessToken);

    const setAuthStore = useAuthStore((state) => state.setAccessToken);

    const routeAuth = () => {
        if (useAuth) {
            // alert("already login");
            router.push("userpanel");
        }
    };

    const loadingLogin = isloading ? (
        <Blocks
            visible={true}
            height="280"
            width="280"
            ariaLabel="blocks-loading"
            wrapperStyle={{}}
            wrapperClass="blocks-wrapper"
        />
    ) : null;

    const handleSubmit = (e: FormEvent<EventTarget | HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const jsonBodyData = {
            email: email,
            password: password,
        };
        axios
            .post(
                `${process.env.NEXT_PUBLIC_API_URL}/login`,
                JSON.stringify(jsonBodyData),
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            )
            .then((response) => {
                setIsLoading(false);
                if (response.data.status === "error") {
                    swal.fire({
                        icon: 'error',
                        title: 'xdding?',
                        text: 'Login failed!',
                    })
                }
                if (response.data.status === "ok") {
                    setAuthStore(response.data.accessToken);
                    swal.fire({
                        icon: 'success',
                        title: 'xdding?',
                        text: 'Login success!',
                    })
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
    }, [useAuth]);

    return (
        <div className="login-page-container">
            {loadingLogin}
            <form method="post" onSubmit={handleSubmit}>
                <div className="login-inputcontainer">
                    <label htmlFor="email-input">Enter your email :D</label>
                    <input
                        className="inputborder"
                        id="email-input"
                        type={email === "admin" ? "text" : "email"}
                        ref={emailRef}
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        required
                    ></input>
                    <label htmlFor="password-input">Enter your password :V</label>
                    <input
                        className="inputborder"
                        id="password-input"
                        type={email === "admin" ? "text" : "password"}
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
                    <div
                        id="toregisref"
                        style={{ marginTop: "12px", opacity: 0.6 }}
                    >
                        or try an global account? admin:1234 or <span style={{ fontWeight: "bold", opacity: 1, zIndex: 100 }}
                            onClick={() => {
                                setEmail("admin");
                                setPassword("1234");
                            }}>Click here</span>
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
