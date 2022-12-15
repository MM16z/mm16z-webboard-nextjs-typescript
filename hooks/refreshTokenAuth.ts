import axios from "axios";
import useAuthStore from "./authstore";

const refreshTokenAuth = () => {
    const useEmailAuth = useAuthStore.getState().userEmail

    const refreshToken = async () => {

        const response = await axios.post("http://localhost:3006/refreshjwtauth",
            JSON.stringify({ email: useEmailAuth }), {
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