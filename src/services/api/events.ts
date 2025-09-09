import axiosInstance from "../../lib/axiosInstance";
import { EventDetails } from "../../types/event";

export interface CreateEventData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  city: string;
  venue: string;
  venueType: string;
  venueSuitability: string[];
  venueCapacity: string;
  venueAmbiance: string;
  venueLocationType: string;
  ticketPrice: number;
  priceCategory: string;
  category: string;
  tags: string[];
  maxAttendees: number;
  imageUrl?: string;
}

export interface UpdateEventData extends Partial<CreateEventData> {}

export interface EventFilters {
  category?: string;
  city?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  dateRange?: {
    start: string;
    end: string;
  };
  venueType?: string;
  tags?: string[];
}

// Events API Service
export const eventsAPI = {
  // Public endpoints
  getAllEvents: async (filters?: EventFilters): Promise<EventDetails[]> => {
    const response = await axiosInstance.get('/events', {
      params: filters
    });
    return response.data;
  },

  browseAllEvents: async (): Promise<EventDetails[]> => {
    const response = await axiosInstance.get('/events/browse/all');
    return response.data;
  },

  getEvent: async (id: string): Promise<EventDetails> => {
    const response = await axiosInstance.get(`/events/${id}`);
    return response.data;
  },

  // Protected endpoints
  getDashboardEvents: async (): Promise<EventDetails[]> => {
    const response = await axiosInstance.get('/events/dashboard');
    return response.data;
  },

  getRecommendedEvents: async (): Promise<any> => {
    const response = await axiosInstance.get('/events/recommendations/for-me');
    return response.data;
  },

  getOrganizerEvents: async (organizerId: string): Promise<EventDetails[]> => {
    const response = await axiosInstance.get(`/events/organizer/${organizerId}`);
    return response.data;
  },

  // CRUD operations
  createEvent: async (eventData: CreateEventData): Promise<EventDetails> => {
    const response = await axiosInstance.post('/events/create', eventData);
    return response.data;
  },

  updateEvent: async (id: string, eventData: UpdateEventData): Promise<EventDetails> => {
    const response = await axiosInstance.put(`/events/${id}`, eventData);
    return response.data;
  },

  deleteEvent: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/events/${id}`);
  },

  // Analytics endpoints
  getOrganizerAnalytics: async (): Promise<any> => {
    const response = await axiosInstance.get('/events/analytics/organizer');
    return response.data;
  },

  getEventAnalytics: async (id: string): Promise<any> => {
    const response = await axiosInstance.get(`/events/${id}/analytics`);
    return response.data;
  },
};
