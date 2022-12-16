import useAuthStore from "../state/authStore";
import getUserAuth from "./getUserAuth";

const reqAuth = async () => {
    const response = await getUserAuth()
        .then()
        .catch(async (err) => {
            if (err) {
                useAuthStore.setState({ accessToken: null })
                return "noAuthorization";
            }
        });
    return response;
};

export default reqAuth