// Participation Types
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
}

// Payment Types  
export interface Payment {
  id: string;
  eventId: string;
  userId: string;
  amount: number;
  currency: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  paymentMethod: string;
  transactionId?: string;
  transactionUUID?: string;
  paymentDate: string;
  refundAmount?: number;
  refundDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Analytics Types
export interface EventAnalytics {
  eventId: string;
  eventTitle: string;
  totalRegistrations: number;
  totalAttended: number;
  totalRevenue: number;
  attendanceRate: number;
  registrationTrend: Array<{
    date: string;
    count: number;
  }>;
  demographicBreakdown: {
    ageGroups: Record<string, number>;
    cities: Record<string, number>;
  };
  feedbackSummary: {
    averageRating: number;
    totalReviews: number;
    sentimentBreakdown: {
      positive: number;
      negative: number;
      neutral: number;
    };
  };
}

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

// Common Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
