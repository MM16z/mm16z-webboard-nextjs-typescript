import { useState, useEffect } from "react";
import axios from "axios";

import useAuthStore from "../store/authStore";
import getUserAuth from "../auth/getUserAuth";

import { GetServerSideProps } from "next";

import Cookies from "js-cookie";
import { Blocks } from "react-loader-spinner";

import { PostDataType } from "../types/PostDataType";
import refreshTokenAuth from "../auth/refreshTokenAuth";
import MainSection from "../sections/main_section/MainSection";

import swal from "sweetalert2";


export default function Home({ posts, error, status, isFetchLoading }: PostDataType) {

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
                    const { userId, username } = response.data.decoded;
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
            // @ts-ignore
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

    if (status === 'loading' || isFetchLoading) {
        swal.fire({
            icon: 'error',
            title: 'Error (กรุณาเข้ามาใหม่ในอีก 1 นาที)',
            text: `currently use free plan (backend), free instance will spin down with inactivity, which can delay requests by 50 seconds or more. 
            / (backend) เซิฟฟรีจะหยุดทำงานเมื่อไม่มีการใช้งาน ซึ่งอาจทำให้การร้องขอล่าช้าไป 50 วินาทีหรือมากกว่านั้น, กรุณาเข้ามาใหม่ในอีก 1 นาที
            `
            ,
        })
        return;
    }

    if (error) {
        swal.fire({
            icon: 'error',
            title: error,
        })
        return;
    }

    return (
        <div className="home-page-container">
            {isLoading ? (
                <Blocks
                    visible={true}
                    height="280"
                    width="280"
                    ariaLabel="blocks-loading"
                    wrapperStyle={{ top: "30%" }}
                    wrapperClass="blocks-wrapper-home"
                />
            ) : null}
            <MainSection posts={posts} />
        </div>
    );
}

// export const getServerSideProps: GetServerSideProps = async (context) => {
//     const controller = new AbortController();
//     const timeout = setTimeout(() => {
//         controller.abort();
//     }, 5000);

//     let currentQuery = Number(context.query.page);
//     if (!currentQuery) {
//         currentQuery = 0;
//     } else {
//         if (currentQuery <= 0) {
//             currentQuery = 1;
//         }
//         currentQuery = (currentQuery - 1) * 6;
//     }

//     let currentUserId = Number(context.req?.cookies?.u_id) || null;

//     const postDataOptions = {
//         method: "GET",
//         url: `${process.env.NEXT_PUBLIC_API_URL}/user_posts/${currentQuery}`,
//         params: { currentUserId: currentUserId },
//         withCredentials: true,
//         signal: controller.signal,
//     };

//     try {
//         const posts = await axios.request(postDataOptions);
//         clearTimeout(timeout);
//         return {
//             props: {
//                 posts: posts.data,
//                 status: 'loaded',
//             },
//         };
//     } catch (error) {
//         clearTimeout(timeout);
//         console.error('Error fetching posts:', error);
//         return {
//             props: {
//                 error: 'Server is starting up, please wait...',
//                 status: 'loading',
//             },
//         };
//     }
// };


export const getServerSideProps: GetServerSideProps = async (context) => {
    let currentQuery = Number(context.query.page) || 1;
    currentQuery = Math.max(1, currentQuery);
    const skip = (currentQuery - 1) * 6;

    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const currentUserId = Number(context.req?.cookies?.u_id) || null;

    const postDataOptions = {
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_API_URL}/user_posts/${skip}`,
        params: { currentUserId },
        withCredentials: true,
    };

    const maxRetries = 4;
    const retryDelay = 15000;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const posts = await axios.request(postDataOptions);
            return { props: { posts: posts.data } };
        } catch (error) {
            if (attempt === maxRetries - 1) {
                return {
                    props: {
                        error: 'Server is starting up. Please wait and refresh in about 50 seconds.',
                        isFetchLoading: true
                    }
                };
            }
            console.error(`Attempt ${attempt + 1} failed. Retrying in ${retryDelay / 1000} seconds...`);
            await wait(retryDelay);
        }
    }

    return { props: { error: 'Unexpected error occurred' } };
};


