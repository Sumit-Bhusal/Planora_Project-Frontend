export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'organizer';
  interests?: string[];
  avatar?: string;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  organizer: User;
  category: string;
  date: Date;
  endDate?: Date;
  location: string;
  venue: string;
  price: number;
  capacity: number;
  registeredCount: number;
  image: string;
  tags: string[];
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface Ticket {
  id: string;
  eventId: string;
  userId: string;
  purchaseDate: Date;
  price: number;
  status: 'valid' | 'used' | 'cancelled';
  qrCode: string;
}

export interface EventAnalytics {
  eventId: string;
  totalRegistrations: number;
  totalRevenue: number;
  attendanceRate: number;
  demographicData: {
    ageGroups: Record<string, number>;
    locations: Record<string, number>;
    interests: Record<string, number>;
  };
  registrationTrend: Array<{
    date: Date;
    count: number;
  }>;
}