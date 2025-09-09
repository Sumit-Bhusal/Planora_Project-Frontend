export interface EventDetails {
  registeredCount: number;
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  price: string;
  category: string;
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
