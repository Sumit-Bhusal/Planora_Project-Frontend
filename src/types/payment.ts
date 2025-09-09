export interface Payment {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  transactionUUID: string;
  eventId: string;
  participationId: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "refunded";
  paymentMethod:
    | "esewa"
    | "khalti"
    | "paypal"
    | "stripe"
    | "credit_card"
    | "debit_card"
    | "bank_transfer";
  paymentDate: string;
}

export interface PaymentDataForPayment {
  amount: number;
  currency: string;
  paymentMethod:
    | "esewa"
    | "khalti"
    | "paypal"
    | "stripe"
    | "credit_card"
    | "debit_card"
    | "bank_transfer";
  participationId: string;
  signature: string;
  signedFields: string;
  transactionUUID: string;
}

export interface PaymentData {
  amount: number;
  currency: string;
  paymentMethod:
    | "esewa"
    | "khalti"
    | "paypal"
    | "stripe"
    | "credit_card"
    | "debit_card"
    | "bank_transfer";
  participationId: string;
}

export interface PaymentResponse {
  status: "success" | "error";
  data: {
    signature: string;
    signedFields: string;
    Payment: Payment;
  } | null;
  message?: string;
}
