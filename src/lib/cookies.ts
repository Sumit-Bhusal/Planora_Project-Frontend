import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "../types/auth";

const cookieName = "planora_auth_token";

export const setCookie = (value: {
  accessToken: string;
  refreshToken: string;
}) => {
  Cookies.set(cookieName, JSON.stringify(value), {
    expires: 1,
    secure: true,
    sameSite: "Strict",
  });
};

export const getCookie = () => {
  return Cookies.get(cookieName);
};

export const removeCookie = () => {
  Cookies.remove(cookieName);
};

export const getUserInfo = async () => {
  const tokenString = getCookie();
  if (!tokenString) return;
  let token;
  try {
    token = JSON.parse(tokenString);
  } catch {
    return;
  }
  if (token?.accessToken) {
    const accessToken = token.accessToken;
    const decodedToken: DecodedToken = jwtDecode(accessToken);
    const user = {
      name: decodedToken?.name || null,
      id: decodedToken?.sub || null,
      email: decodedToken?.email || null,
      roles: decodedToken?.roles || [],
    };
    return user;
  }
};
