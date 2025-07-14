import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "../types/auth";

export const decodeToken = async (token: string) => {
  const decodedToken: DecodedToken = await jwtDecode(token);
  return decodedToken;
};
