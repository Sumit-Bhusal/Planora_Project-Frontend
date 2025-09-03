import axios from "axios";
import { RegisterData, LoginData } from "../../types/auth";
import axiosInstance from '../../lib/axiosInstance';

export const registerUserandOrganizer = async (data: RegisterData) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/register`,
      data
    );

    if (response.status === 201) {
      return {
        status: "success",
        data: response.data,
      };
    }
  } catch (error: any) {
    console.error(error);

    if (error.response && error.response.data) {
      const errorData = error.response.data;

      const message = Array.isArray(errorData.error?.message)
        ? errorData.error.message.join(", ")
        : errorData.error?.message || "An unknown error occurred";

      return {
        status: "error",
        data: null,
        message: message,
      };
    }

    return {
      status: "error",
      data: null,
      message: "Failed to send your request due to a network or server error",
    };
  }
};

export const UserLogin = async (data: LoginData) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/login`,
      data
    );

    if (response.status === 201) {
      return {
        status: "success",
        data: response.data,
      };
    }
  } catch (error: any) {
    console.error(error);

    if (error.response && error.response.data) {
      const errorData = error.response.data;

      const message = Array.isArray(errorData.error?.message)
        ? errorData.error.message.join(", ")
        : errorData.error?.message || "An unknown error occurred";

      return {
        status: "error",
        data: null,
        message: message,
      };
    }

    return {
      status: "error",
      data: null,
      message: "Failed to send your request due to a network or server error",
    };
  }
};

export const loginUser = async (data: any) => {
  return axiosInstance.post('/auth/login', data);
};
