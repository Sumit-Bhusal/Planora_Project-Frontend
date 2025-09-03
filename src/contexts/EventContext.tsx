import React, { createContext, useContext, useState, useEffect } from "react";
import { Event, EventAnalytics } from "../types";
import {
  fetchAllEvents,
  fetchEventByOrganizerId,
  createEvent as createEventAPI,
  updateEvent as updateEventAPI,
  deleteEvent as deleteEventAPI,
} from "../actions/event/event";
import { getUserInfo } from "../lib/cookies";

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
  registerForEvent: (eventId: string) => void;
  getEventAnalytics: (eventId: string) => EventAnalytics | null;
  searchEvents: (
    query: string,
    filters?: { category?: string; date?: Date; location?: string }
  ) => Event[];
  getRecommendedEvents: (userInterests: string[]) => Event[];
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

  const fetchEvents = async () => {
    const response = await fetchAllEvents();
    if (response && response.status === "success") {
      setEvents(response.data);
    } else {
      setEvents([]);
      console.error("Failed to fetch events:", response?.message);
    }
  };

  const fetchOrganizerEvents = async () => {
    const user = await getUserInfo();
    if (user) {
      const response = await fetchEventByOrganizerId(user.id!);
      if (response && response.status === "success") {
        setOrganizerEvents(response.data);
      } else {
        setOrganizerEvents([]);
        console.error("Failed to fetch organizer events:", response?.message);
      }
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchOrganizerEvents();
  }, []);

  const createEvent = async (eventData: CreateEventData) => {
    await createEventAPI(eventData);
    await fetchEvents();
  };

  const updateEvent = async (id: string, eventData: Partial<Event>) => {
    await updateEventAPI(id, eventData);
    await fetchEvents();
  };

  const deleteEvent = async (id: string) => {
    await deleteEventAPI(id);
    await fetchEvents();
  };

  const registerForEvent = (eventId: string) => {
    const event = events.find((e) => e.id === eventId);
    if (event && !userEvents.find((e) => e.id === eventId)) {
      setUserEvents((prev) => [...prev, event]);
      setEvents((prev) =>
        prev.map((e) =>
          e.id === eventId
            ? { ...e, registeredCount: e.currentAttendees + 1 }
            : e
        )
      );
    }
  };

  const getEventAnalytics = (eventId: string): EventAnalytics | null => {
    const event = events.find((e) => e.id === eventId);
    if (!event) return null;

    return {
      eventId,
      totalRegistrations: event.currentAttendees,
      totalRevenue: Number(event.currentAttendees) * Number(event.ticketPrice),
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
          count: event.currentAttendees * event.maxAttendees,
        },
      ],
    };
  };

  const searchEvents = (
    query: string,
    filters?: { category?: string; date?: Date; location?: string }
  ) => {
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

  const getRecommendedEvents = (userInterests: string[]) => {
    return events
      .filter((event) =>
        userInterests.some((interest) =>
          event.category.toLowerCase().includes(interest.toLowerCase())
        )
      )
      .slice(0, 6);
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
