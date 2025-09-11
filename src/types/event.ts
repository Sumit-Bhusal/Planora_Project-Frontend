export interface EventDetails {
  registeredCount: number;
  id: string;
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
  currentAttendees: number;
  organizer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  imageUrl?: string | null;
  // Legacy fields for backward compatibility
  location?: string;
  price?: string;
}

export interface RegisterResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  eventId: string;
  status: "registered" | "cancelled" | "confirmed";
  registrationDate: string;
  isAttended: boolean;
  notes?: string | null;
}
