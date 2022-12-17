import { authAxios } from "../axios/axios";
import useAuthStore from "../state/authStore";

const getUserAuth = async () => {
  const useAuth = useAuthStore.getState().accessToken

  const response = await authAxios.post(
    "https://good-puce-squirrel-wear.cyclic.app/jwtauth",
    JSON.stringify({}),
    {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${useAuth}`,
      },
    })
  return response
};


export default getUserAuth;
