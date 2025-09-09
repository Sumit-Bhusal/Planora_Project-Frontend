import axiosInstance from "../../lib/axiosInstance";
import { EventAnalytics } from "../../types";

export interface OrganizerAnalytics {
  summary: {
    totalEvents: number;
    totalRegistrations: number;
    totalRevenue: number;
    totalAttended: number;
    upcomingEvents: number;
    pastEvents: number;
    averageAttendanceRate: number;
    averageRevenuePerEvent: number;
  };
  eventAnalytics: EventAnalytics[];
}

export const analyticsAPI = {
  // Get overall analytics for organizer
  getOrganizerAnalytics: async (): Promise<OrganizerAnalytics> => {
    const response = await axiosInstance.get("/events/analytics/organizer");
    return response.data;
  },

  // Get detailed analytics for a specific event
  getEventAnalytics: async (eventId: string): Promise<EventAnalytics> => {
    const response = await axiosInstance.get(`/events/${eventId}/analytics`);
    return response.data;
  },
};
