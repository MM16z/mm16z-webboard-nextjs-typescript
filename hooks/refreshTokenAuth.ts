import { authAxios } from "../axios/axios";
import useAuthStore from "../state/authStore";

const refreshTokenAuth = () => {
    // const useUserName = useAuthStore.getState().userName //move to refreshToken

    const refreshToken = async () => {
        const useUserName = useAuthStore.getState().userName

        const response = await authAxios.post("https://attractive-dog-vest.cyclic.app/refreshjwtauth",
            JSON.stringify({ username: useUserName }), {
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true
        });
        useAuthStore.setState({ accessToken: response.data.accessToken })
        return response.data.accessToken;
    }
    return refreshToken;
}

export default refreshTokenAuth