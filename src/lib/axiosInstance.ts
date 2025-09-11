import axios from "axios";
import { getCookie } from "./cookies";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getCookie();
    if (token) {
      let accessToken: string | undefined;
      try {
        const parsedToken =
          typeof token === "string" ? JSON.parse(token) : token;
        accessToken = parsedToken?.accessToken;
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      } catch (e) {
        console.error("Error parsing token:", e);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Authentication failed - redirecting to login");
      // Remove invalid token
      import("./cookies").then(({ removeCookie }) => {
        removeCookie();
        localStorage.removeItem("user");
        window.location.href = "/auth/login";
      });
    }
    if (error.response?.status === 403) {
      console.error("Authorization failed - insufficient permissions");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
