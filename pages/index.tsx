import {useState, useEffect} from "react";
import axios from "axios";

import useAuthStore from "../global_state/authStore";
import getUserAuth from "../hooks/getUserAuth";

import {GetServerSideProps} from "next";

import Cookies from "js-cookie";
import {Blocks} from "react-loader-spinner";

import {PostDataType} from "../types/PostDataType";
import refreshTokenAuth from "../hooks/refreshTokenAuth";
import MainSection from "../sections/main_section/MainSection";


export default function Home({posts}: PostDataType) {

    const useAuth = useAuthStore((state: any) => state.accessToken);

    const setAuthStore = useAuthStore((state: any) => state.setAccessToken);
    const setUserId = useAuthStore((state: any) => state.setUserId);
    const setUserName = useAuthStore((state: any) => state.setUserName);

    const [isLoading, setIsLoading] = useState(true);

    const refresh = refreshTokenAuth();

    const routeAuth = async () => {
        try {
            const useAuth = useAuthStore.getState().accessToken;

            if (useAuth) {
                const response = await getUserAuth();

                if (response && response.data && response.data.decoded) {
                    const {userId, username} = response.data.decoded;
                    setUserId(userId);
                    setUserName(username);
                    Cookies.set("u_id", userId);
                } else {
                    throw new Error("Invalid response data");
                }
            } else {
                Cookies.set("u_id", "");
                // call logout API to delete the cookie later
            }
        } catch (error) {
            console.error("An error occurred:", error);
            // Call logout API to delete the cookie later
            Cookies.set("u_id", "");
            setAuthStore(null);
            window.location.href = "/";
        }
        setIsLoading(false);
    };

    const verifyRefreshToken = async () => {
        try {
            await refresh();
        } catch (error) {
            Cookies.set("u_id", "");
            console.error(error?.response?.data);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        console.log("meow");
    }, []);

    useEffect(() => {
        if (!useAuth) {
            verifyRefreshToken()
            return;
        }
        routeAuth();
    }, [useAuth]);

    return (
        <div className="home-page-container">
            {isLoading ? (
                <Blocks
                    visible={true}
                    height="280"
                    width="280"
                    ariaLabel="blocks-loading"
                    wrapperStyle={{top: "20%"}}
                    wrapperClass="blocks-wrapper-home"
                />
            ) : null}
            <MainSection posts={posts}/>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    // context.res.setHeader(
    //   "Cache-Control",
    //   "public, s-maxage=10, stale-while-revalidate=59"
    // );
    let currentQuery = Number(context.query.page);
    if (!currentQuery) {
        currentQuery = 0;
    } else {
        if (currentQuery <= 0) {
            currentQuery = 1;
        }
        currentQuery = (currentQuery - 1) * 6;
    }
    //will set/use secure cookie on api endpoint instend of client side cookie later
    let currentUserId = Number(context.req?.cookies?.u_id) || null;

    const postDataOptions = {
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_API_URL}/user_posts/${currentQuery}`,
        params: {currentUserId: currentUserId},
        withCredentials: true,
    };
    const posts = await axios.request(postDataOptions);

    return {
        props: {
            posts: posts.data,
        },
    };
};


