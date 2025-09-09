import axiosInstance from "../../lib/axiosInstance";
import { RegisterResponse } from "../../types/event";

export const createEvent = async (data: any) => {
  return axiosInstance.post("/events/create", data);
};

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

// Function for fetching role-specific events (dashboard view)
export const fetchDashboardEvents = async () => {
  try {
    const response = await axiosInstance.get("/events/dashboard");

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
      message: "Failed to fetch dashboard events due to a network or server error",
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

export const registerForEvent = async (
  eventId: string
): Promise<RegisterResponse> => {
  try {
    const response = await axiosInstance.post(`/participation/${eventId}`);

    if (response.status === 201) {
      // Backend returns { success: true, message: string, data: RegisterResponse }
      return response.data.data as RegisterResponse;
    } else {
      throw new Error("Failed to register for event");
    }
  } catch (error: any) {
    console.error(error);

    let message = "Failed to register for event due to a network or server error";
    
    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data;
      
      if (status === 409) {
        // Conflict - user already registered
        message = errorData.message || "You have already registered for this event";
      } else if (status === 400) {
        // Bad request - event full, etc.
        message = errorData.message || "Cannot register for this event";
      } else if (status === 404) {
        // Event not found
        message = "Event not found";
      } else if (errorData) {
        // Extract backend error message
        message = Array.isArray(errorData.error?.message)
          ? errorData.error.message.join(", ")
          : errorData.error?.message || errorData.message || message;
      }
    }
    
    throw new Error(message);
  }
};

export const updateEvent = async (id: string, data: any) => {
  return axiosInstance.put(`/events/${id}`, data);
};

export const deleteEvent = async (id: string) => {
  return axiosInstance.delete(`/events/${id}`);
};

export const checkRegistrationStatus = async (eventId: string) => {
  try {
    const response = await axiosInstance.get(`/participation/check/${eventId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to check registration status:', error);
    return { isRegistered: false, status: null, registrationDate: null };
  }
};
