import axiosInstance from "../../lib/axiosInstance";

export const fetchAllEvents = async () => {
  try {
    const response = await axiosInstance.get("/events");

    if (response.status === 200) {
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
      message: "Failed to fetch events due to a network or server error",
    };
  }
};

export const fetchEventByOrganizerId = async (organizerId: string) => {
  try {
    const response = await axiosInstance.get(
      `/events/organizer/${organizerId}`
    );

    if (response.status === 200) {
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
      message: "Failed to fetch event due to a network or server error",
    };
  }
};
