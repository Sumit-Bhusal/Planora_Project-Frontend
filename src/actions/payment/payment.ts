import axiosInstance from "../../lib/axiosInstance";
import { PaymentData, PaymentResponse } from "../../types/payment";

export const makePayment = async (
  eventId: string,
  paymentData: PaymentData
): Promise<PaymentResponse> => {
  try {
    const response = await axiosInstance.post(
      `/payments/initiate/${eventId}`,
      paymentData
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

  // Default return to satisfy return type
  return {
    status: "error",
    data: null,
    message: "An unknown error occurred",
  };
};

export const verifyPayment = async (transactionId: string, amount: number) => {
  try {
    const response = await axiosInstance.post(
      `/payments/verify-payment/${transactionId}/${amount}`
    );

    console.log(response);

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
  }
};
