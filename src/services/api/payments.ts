import axiosInstance from "../../lib/axiosInstance";

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
  event?: {
    id: string;
    title: string;
    startDate: string;
    venue: string;
  };
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreatePaymentData {
  amount: number;
  currency?: string;
  paymentMethod: string;
  // Add other payment fields as needed
}

export interface UpdatePaymentData {
  paymentStatus?: 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  transactionId?: string;
  paymentDate?: string;
}

export interface ProcessRefundData {
  amount: number;
  reason?: string;
}

export interface PaymentVerificationResponse {
  success: boolean;
  payment?: Payment;
  message: string;
}

export interface PaymentStats {
  totalRevenue: number;
  totalTransactions: number;
  successfulPayments: number;
  failedPayments: number;
  refundedAmount: number;
  averageTransactionAmount: number;
}

// Payments API Service
export const paymentsAPI = {
  // Initiate payment for an event
  initiatePayment: async (eventId: string, paymentData: CreatePaymentData): Promise<Payment> => {
    const response = await axiosInstance.post(`/payments/initiate/${eventId}`, paymentData);
    return response.data;
  },

  // Verify payment
  verifyPayment: async (transactionUUID: string, amount: number): Promise<PaymentVerificationResponse> => {
    const response = await axiosInstance.post(`/payments/verify-payment/${transactionUUID}/${amount}`);
    return response.data;
  },

  // Get all payments (admin only)
  getAllPayments: async (): Promise<Payment[]> => {
    const response = await axiosInstance.get('/payments');
    return response.data;
  },

  // Get current user's payments
  getMyPayments: async (): Promise<Payment[]> => {
    const response = await axiosInstance.get('/payments/my-payments');
    return response.data;
  },

  // Get payments for a specific event (organizer/admin only)
  getEventPayments: async (eventId: string): Promise<Payment[]> => {
    const response = await axiosInstance.get(`/payments/event/${eventId}`);
    return response.data;
  },

  // Get payment statistics for an event (organizer/admin only)
  getEventPaymentStats: async (eventId: string): Promise<PaymentStats> => {
    const response = await axiosInstance.get(`/payments/event/${eventId}/stats`);
    return response.data;
  },

  // Get specific payment
  getPayment: async (id: string): Promise<Payment> => {
    const response = await axiosInstance.get(`/payments/${id}`);
    return response.data;
  },

  // Update payment
  updatePayment: async (id: string, data: UpdatePaymentData): Promise<Payment> => {
    const response = await axiosInstance.patch(`/payments/${id}`, data);
    return response.data;
  },

  // Process refund
  processRefund: async (id: string, refundData: ProcessRefundData): Promise<Payment> => {
    const response = await axiosInstance.patch(`/payments/${id}/refund`, refundData);
    return response.data;
  },

  // Delete payment
  deletePayment: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/payments/${id}`);
  },
};
