import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "../types/auth";

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp <= currentTime;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
};
