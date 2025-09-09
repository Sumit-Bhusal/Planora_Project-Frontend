import axiosInstance from "../../lib/axiosInstance";

export interface Participation {
  id: string;
  userId: string;
  eventId: string;
  status: 'registered' | 'cancelled' | 'confirmed' | 'attended';
  registrationDate: string;
  isAttended: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  event?: {
    id: string;
    title: string;
    startDate: string;
    venue: string;
    city: string;
  };
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ParticipationResponse {
  success: boolean;
  message: string;
  data?: Participation;
}

export interface RegistrationCheck {
  isRegistered: boolean;
  status: string | null;
  registrationDate: string | null;
}

export interface UpdateParticipationData {
  status?: 'registered' | 'cancelled' | 'confirmed' | 'attended';
  notes?: string;
  isAttended?: boolean;
}

// Participation API Service
export const participationAPI = {
  // Register for an event
  register: async (eventId: string): Promise<ParticipationResponse> => {
    const response = await axiosInstance.post(`/participation/${eventId}`);
    return response.data;
  },

  // Get all participations (admin only)
  getAllParticipations: async (): Promise<Participation[]> => {
    const response = await axiosInstance.get('/participation');
    return response.data;
  },

  // Get current user's participations
  getMyParticipations: async (): Promise<Participation[]> => {
    const response = await axiosInstance.get('/participation/my-participations');
    return response.data;
  },

  // Check if user is registered for an event
  checkRegistration: async (eventId: string): Promise<RegistrationCheck> => {
    const response = await axiosInstance.get(`/participation/check/${eventId}`);
    return response.data;
  },

  // Get all participants for an event (organizer/admin only)
  getEventParticipants: async (eventId: string): Promise<Participation[]> => {
    const response = await axiosInstance.get(`/participation/event/${eventId}`);
    return response.data;
  },

  // Get specific participation
  getParticipation: async (id: string): Promise<Participation> => {
    const response = await axiosInstance.get(`/participation/${id}`);
    return response.data;
  },

  // Update participation
  updateParticipation: async (id: string, data: UpdateParticipationData): Promise<Participation> => {
    const response = await axiosInstance.patch(`/participation/${id}`, data);
    return response.data;
  },

  // Cancel participation
  cancelParticipation: async (id: string): Promise<void> => {
    await axiosInstance.patch(`/participation/${id}/cancel`);
  },

  // Confirm attendance (organizer/admin only)
  confirmAttendance: async (id: string): Promise<Participation> => {
    const response = await axiosInstance.patch(`/participation/${id}/confirm-attendance`);
    return response.data;
  },

  // Delete participation
  deleteParticipation: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/participation/${id}`);
  },
};
