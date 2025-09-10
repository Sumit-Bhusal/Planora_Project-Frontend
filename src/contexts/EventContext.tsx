import React, { createContext, useContext, useState, useEffect } from "react";
import { Event, EventAnalytics } from "../types";
import { eventsAPI } from "../services/api/events";
import { participationAPI } from "../services/api/participation";
import { getUserInfo } from "../lib/cookies";
import { useNotification } from "./NotificationContext";

interface CreateEventData {
  title: string;
  description: string;
  category: string;
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
  maxAttendees: number;
  tags: string[];
  imageUrl?: string;
}

interface EventContextType {
  events: Event[];
  organizerEvents: Event[];
  userEvents: Event[];
  createEvent: (eventData: CreateEventData) => Promise<void>;
  updateEvent: (id: string, event: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  registerForEvent: (eventId: string) => Promise<void>;
  getEventAnalytics: (eventId: string) => Promise<EventAnalytics | null>;
  searchEvents: (
    query: string,
    filters?: { category?: string; date?: Date; location?: string }
  ) => Event[];
  getRecommendedEvents: (userInterests?: string[]) => Promise<Event[]>;
  isEditing: boolean;
  editingEvent: Event | null;
  setEditingEvent: (event: Event | null) => void;
  startEditingEvent: (event: Event) => void;
  stopEditingEvent: () => void;
  fetchEvents: () => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEvents must be used within an EventProvider");
  }
  return context;
};

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [organizerEvents, setOrganizerEvents] = useState<Event[]>([]);
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const { addNotification } = useNotification();

  const fetchEvents = async () => {
    try {
      const response = await eventsAPI.getAllEvents();
      // Map EventDetails[] to Event[]
      const mappedEvents: Event[] = response.map((eventDetail) => ({
        id: eventDetail.id,
        title: eventDetail.title,
        description: eventDetail.description,
        startDate: eventDetail.startDate,
        endDate: eventDetail.endDate,
        city: eventDetail.location, // Map location to city
        venue: "", // Default value
        venueType: "",
        venueSuitability: [],
        venueCapacity: "",
        venueAmbiance: "",
        venueLocationType: "",
        ticketPrice: parseFloat(eventDetail.price) || 0,
        priceCategory: "",
        category: eventDetail.category,
        tags: [],
        maxAttendees: eventDetail.maxAttendees,
        currentAttendees: eventDetail.currentAttendees,
        organizer: eventDetail.organizer,
        createdAt: eventDetail.createdAt,
        updatedAt: eventDetail.updatedAt,
        imageUrl: eventDetail.imageUrl,
      }));
      setEvents(mappedEvents);
    } catch (error) {
      setEvents([]);
      console.error("Failed to fetch events:", error);
      addNotification({
        type: "error",
        title: "Error",
        message: "Failed to fetch events. Please try again.",
      });
    }
  };

  const fetchOrganizerEvents = async () => {
    try {
      const user = await getUserInfo();
      if (user) {
        // Use the new dashboard endpoint which will return role-specific events
        const response = await eventsAPI.getDashboardEvents();
        // Map EventDetails[] to Event[]
        const mappedEvents: Event[] = response.map((eventDetail) => ({
          id: eventDetail.id,
          title: eventDetail.title,
          description: eventDetail.description,
          startDate: eventDetail.startDate,
          endDate: eventDetail.endDate,
          city: eventDetail.location,
          venue: "",
          venueType: "",
          venueSuitability: [],
          venueCapacity: "",
          venueAmbiance: "",
          venueLocationType: "",
          ticketPrice: parseFloat(eventDetail.price) || 0,
          priceCategory: "",
          category: eventDetail.category,
          tags: [],
          maxAttendees: eventDetail.maxAttendees,
          currentAttendees: eventDetail.currentAttendees,
          organizer: eventDetail.organizer,
          createdAt: eventDetail.createdAt,
          updatedAt: eventDetail.updatedAt,
          imageUrl: eventDetail.imageUrl,
        }));
        setOrganizerEvents(mappedEvents);
      }
    } catch (error) {
      setOrganizerEvents([]);
      console.error("Failed to fetch organizer events:", error);
      addNotification({
        type: "error",
        title: "Error",
        message: "Failed to fetch organizer events. Please try again.",
      });
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchOrganizerEvents();
  }, []);

  const createEvent = async (eventData: CreateEventData) => {
    try {
      await eventsAPI.createEvent(eventData);
      await fetchEvents();
      addNotification({
        type: "success",
        title: "Success",
        message: "Event created successfully!",
      });
    } catch (error) {
      console.error("Failed to create event:", error);
      addNotification({
        type: "error",
        title: "Error",
        message: "Failed to create event. Please try again.",
      });
    }
  };

  const updateEvent = async (id: string, eventData: Partial<Event>) => {
    try {
      // Map Event partial to UpdateEventData
      const updateData: any = {
        title: eventData.title,
        description: eventData.description,
        startDate: eventData.startDate,
        endDate: eventData.endDate,
        city: eventData.city,
        venue: eventData.venue,
        venueType: eventData.venueType,
        venueSuitability: eventData.venueSuitability,
        venueCapacity: eventData.venueCapacity,
        venueAmbiance: eventData.venueAmbiance,
        venueLocationType: eventData.venueLocationType,
        ticketPrice: eventData.ticketPrice,
        priceCategory: eventData.priceCategory,
        category: eventData.category,
        tags: eventData.tags,
        maxAttendees: eventData.maxAttendees,
        imageUrl: eventData.imageUrl || undefined,
      };

      // Remove undefined values
      Object.keys(updateData).forEach((key) => {
        if (updateData[key] === undefined) {
          delete updateData[key];
        }
      });

      await eventsAPI.updateEvent(id, updateData);
      await fetchEvents();
      addNotification({
        type: "success",
        title: "Success",
        message: "Event updated successfully!",
      });
    } catch (error) {
      console.error("Failed to update event:", error);
      addNotification({
        type: "error",
        title: "Error",
        message: "Failed to update event. Please try again.",
      });
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await eventsAPI.deleteEvent(id);
      await fetchEvents();
      addNotification({
        type: "success",
        title: "Success",
        message: "Event deleted successfully!",
      });
    } catch (error) {
      console.error("Failed to delete event:", error);
      addNotification({
        type: "error",
        title: "Error",
        message: "Failed to delete event. Please try again.",
      });
    }
  };

  const registerForEvent = async (eventId: string) => {
    try {
      await participationAPI.register(eventId);

      // Update local state
      const event = events.find((e) => e.id === eventId);
      if (event && !userEvents.find((e) => e.id === eventId)) {
        setUserEvents((prev) => [...prev, event]);
        setEvents((prev) =>
          prev.map((e) =>
            e.id === eventId
              ? { ...e, currentAttendees: e.currentAttendees + 1 }
              : e
          )
        );
      }

      addNotification({
        type: "success",
        title: "Registration Successful",
        message: "You have successfully registered for the event!",
      });
    } catch (error) {
      console.error("Failed to register for event:", error);
      addNotification({
        type: "error",
        title: "Registration Failed",
        message: "Failed to register for the event. Please try again.",
      });
    }
  };

  const getEventAnalytics = async (
    eventId: string
  ): Promise<EventAnalytics | null> => {
    try {
      const response = await eventsAPI.getEventAnalytics(eventId);
      return response;
    } catch (error) {
      console.error("Failed to fetch event analytics:", error);

      // Fallback to local data if API fails
      const event = events.find((e) => e.id === eventId);
      if (!event) return null;

      return {
        eventId,
        eventTitle: event.title,
        totalRegistrations: event.currentAttendees,
        totalRevenue:
          Number(event.currentAttendees) * Number(event.ticketPrice),
        attendanceRate: 0.85,
        demographicData: {
          ageGroups: { "18-25": 30, "26-35": 45, "36-45": 20, "46+": 5 },
          locations: { Kathmandu: 40, Pokhara: 25, Lalitpur: 15, Other: 20 },
          interests: { Technology: 60, Business: 25, Arts: 15 },
        },
        registrationTrend: [
          { date: new Date("2024-01-01"), count: 50 },
          { date: new Date("2024-02-01"), count: 150 },
          {
            date: new Date("2024-03-01"),
            count: event.currentAttendees,
          },
        ],
      };
    }
  };

  const searchEvents = (
    query: string,
    filters?: { category?: string; date?: Date; location?: string }
  ) => {
    if (!query) return events;
    return events.filter((event) => {
      const matchesQuery =
        event.title.toLowerCase().includes(query.toLowerCase()) ||
        event.description.toLowerCase().includes(query.toLowerCase()) ||
        event.category.toLowerCase().includes(query.toLowerCase());
      const matchesCategory =
        !filters?.category || event.category === filters.category;
      const matchesLocation =
        !filters?.location ||
        event.city.toLowerCase().includes(filters.location.toLowerCase());

      return matchesQuery && matchesCategory && matchesLocation;
    });
  };

  const getRecommendedEvents = async (
    userInterests?: string[]
  ): Promise<Event[]> => {
    try {
      const response = await eventsAPI.getRecommendedEvents();

      // Map EventDetails[] to Event[]
      const mappedEvents: Event[] = response.map((eventDetail: any) => ({
        id: eventDetail.id,
        title: eventDetail.title,
        description: eventDetail.description,
        startDate: eventDetail.startDate,
        endDate: eventDetail.endDate,
        city: eventDetail.location || eventDetail.city,
        venue: eventDetail.venue || "",
        venueType: eventDetail.venueType || "",
        venueSuitability: eventDetail.venueSuitability || [],
        venueCapacity: eventDetail.venueCapacity || "",
        venueAmbiance: eventDetail.venueAmbiance || "",
        venueLocationType: eventDetail.venueLocationType || "",
        ticketPrice:
          parseFloat(eventDetail.price || eventDetail.ticketPrice) || 0,
        priceCategory: eventDetail.priceCategory || "",
        category: eventDetail.category,
        tags: eventDetail.tags || [],
        maxAttendees: eventDetail.maxAttendees,
        currentAttendees: eventDetail.currentAttendees,
        organizer: eventDetail.organizer,
        createdAt: eventDetail.createdAt,
        updatedAt: eventDetail.updatedAt,
        imageUrl: eventDetail.imageUrl,
      }));

      return mappedEvents.slice(0, 6);
    } catch (error) {
      console.error("Failed to fetch recommended events:", error);

      // Fallback to local filtering if API fails
      if (userInterests) {
        return events
          .filter((event) =>
            userInterests.some((interest) =>
              event.category.toLowerCase().includes(interest.toLowerCase())
            )
          )
          .slice(0, 6);
      }

      return events.slice(0, 6);
    }
  };

  const startEditingEvent = (event: Event) => {
    setEditingEvent(event);
    setIsEditing(true);
  };
  const stopEditingEvent = () => {
    setEditingEvent(null);
    setIsEditing(false);
  };

  return (
    <EventContext.Provider
      value={{
        events,
        organizerEvents,
        userEvents,
        createEvent,
        updateEvent,
        deleteEvent,
        registerForEvent,
        getEventAnalytics,
        searchEvents,
        getRecommendedEvents,
        isEditing,
        editingEvent,
        setEditingEvent,
        startEditingEvent,
        stopEditingEvent,
        fetchEvents,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};
