import axios from "axios";
import useAuthStore from "../global_state/authStore";

export const refreshAxios = axios.create();


const refreshTokenAuth = () => {

    const refreshToken = async () => {
        const useUserName = useAuthStore.getState().userName

        const response = await refreshAxios.post(`${process.env.NEXT_PUBLIC_API_URL}/refreshjwtauth`,
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