import axios from "axios";
import refreshTokenAuth from "../auth/refreshTokenAuth";

export const authAxios = axios.create();

let refreshTokenPromise: Promise<string> | null = null;
const refreshToken = refreshTokenAuth();

authAxios.interceptors.response.use(
    response => response,
    async (error) => {
        if (error.response.status === 403) {
            // If there is no ongoing refresh token request,
            // create a new promise to refresh the token
            if (!refreshTokenPromise) {
                refreshTokenPromise = refreshToken().then(
                    (newAccessToken: string) => {
                        refreshTokenPromise = null;
                        return newAccessToken;
                    },
                    (error) => {
                        refreshTokenPromise = null;
                        return Promise.reject(error);
                    }
                );
            }
            // Retry the original request after the token has been refreshed
            return refreshTokenPromise.then((newAccessToken: string) =>
                axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/jwtauth`,
                    JSON.stringify({}),
                    {
                        headers: {
                            "Content-Type": "application/json",
                            authorization: `Bearer ${newAccessToken}`,
                        },
                    }
                )
            );
        }
        return Promise.reject(error);
    }
);
