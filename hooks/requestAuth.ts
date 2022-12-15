import useAuthStore from "./authstore";
import getUserAuth from "./getUserAuth";

const reqAuth = async () => {
    const response = await getUserAuth()
        .then()
        .catch(async (err) => {
            if ((await err.response.status) === 403) {
                useAuthStore.setState({ accessToken: null })
                return "noAuthorization";
            }
        });
    return response;
};

export default reqAuth