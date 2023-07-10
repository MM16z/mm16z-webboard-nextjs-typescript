import { authAxios } from "../axios/axios";
import useAuthStore from "../global_state/authStore";

const getUserAuth = async () => {
  const useAuth = useAuthStore.getState().accessToken

  const response = await authAxios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/jwtauth`,
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
