import axios from "axios";
import useAuthStore from "./authstore";
import refreshTokenAuth from "./refreshTokenAuth";

const getUserAuth = async () => {
  const useAuth = useAuthStore.getState().accessToken
  const refreshToken = refreshTokenAuth();

  const axiosInstance = axios.create();
  axiosInstance.interceptors.response.use(
    response => response,
    async error => {
      if (error.response.status === 403) {
        const newAccessToken = await refreshToken();
        return axios.post(
          "http://localhost:3006/jwtauth",
          JSON.stringify({}),
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${newAccessToken}`,
            },
          }
        );
      }
      return Promise.reject(error);
    }
  );

  const response = await axiosInstance.post(
    "http://localhost:3006/jwtauth",
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
