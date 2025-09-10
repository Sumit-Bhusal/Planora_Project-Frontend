import axiosInstance from "../../lib/axiosInstance";

export interface CreateFeedbackDto {
  eventId: string;
  reviewText: string;
  rating: number;
  sentiment: "positive" | "negative" | "neutral";
}

export interface UpdateFeedbackDto {
  reviewText?: string;
  rating?: number;
  sentiment?: "positive" | "negative" | "neutral";
}

export interface Feedback {
  id: string;
  eventId: string;
  userId: string;
  reviewText: string;
  rating: number;
  sentiment: string;
  createdAt: string;
  updatedAt: string;
  event?: {
    id: string;
    title: string;
  };
  user?: {
    id: string;
    name: string;
  };
}

// Create feedback
export const createFeedback = async (
  feedbackData: CreateFeedbackDto
): Promise<Feedback> => {
  const response = await axiosInstance.post("/feedbacks", feedbackData);
  return response.data;
};

// Get all feedbacks
export const getAllFeedbacks = async (): Promise<Feedback[]> => {
  const response = await axiosInstance.get("/feedbacks");
  return response.data;
};

// Get feedbacks for specific event
export const getEventFeedbacks = async (
  eventId: string
): Promise<Feedback[]> => {
  const response = await axiosInstance.get(`/feedbacks/event/${eventId}`);
  return response.data;
};

// Get current user's feedbacks
export const getMyFeedbacks = async (): Promise<Feedback[]> => {
  const response = await axiosInstance.get("/feedbacks/my-feedbacks");
  return response.data;
};

// Get specific feedback
export const getFeedback = async (id: string): Promise<Feedback> => {
  const response = await axiosInstance.get(`/feedbacks/${id}`);
  return response.data;
};

// Update feedback
export const updateFeedback = async (
  id: string,
  updateData: UpdateFeedbackDto
): Promise<Feedback> => {
  const response = await axiosInstance.put(`/feedbacks/${id}`, updateData);
  return response.data;
};

// Delete feedback
export const deleteFeedback = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/feedbacks/${id}`);
};
