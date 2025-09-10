import React, { useState } from "react";
import {
  CreditCard,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import Card from "../UI/Card";
import Button from "../UI/Button";
import { paymentsAPI } from "../../services/api/payments";
import { useNotification } from "../../contexts/NotificationContext";

interface PaymentFormProps {
  eventId: string;
  eventTitle: string;
  amount: number;
  currency?: string;
  onSuccess?: (payment: any) => void;
  onCancel?: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  eventId,
  eventTitle,
  amount,
  currency = "USD",
  onSuccess,
  onCancel,
}) => {
  const { addNotification } = useNotification();
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<
    "form" | "processing" | "success" | "failed"
  >("form");

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setPaymentStep("processing");

    try {
      const payment = await paymentsAPI.initiatePayment(eventId, {
        amount,
        currency,
        paymentMethod,
      });

      // Simulate payment processing
      setTimeout(async () => {
        try {
          const verificationResult = await paymentsAPI.verifyPayment(
            payment.transactionUUID || "temp-uuid",
            amount
          );

          if (verificationResult.success) {
            setPaymentStep("success");
            addNotification({
              type: "success",
              title: "Payment Successful!",
              message: `Your payment for ${eventTitle} has been processed successfully.`,
            });
            onSuccess?.(verificationResult.payment);
          } else {
            throw new Error("Payment verification failed");
          }
        } catch (error) {
          setPaymentStep("failed");
          addNotification({
            type: "error",
            title: "Payment Failed",
            message:
              "There was an issue processing your payment. Please try again.",
          });
        }
      }, 2000);
    } catch (error) {
      console.error("Payment initiation failed:", error);
      setPaymentStep("failed");
      addNotification({
        type: "error",
        title: "Payment Error",
        message: "Failed to initiate payment. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getStepIcon = () => {
    switch (paymentStep) {
      case "processing":
        return <Clock className="h-12 w-12 text-blue-500 animate-spin" />;
      case "success":
        return <CheckCircle className="h-12 w-12 text-green-500" />;
      case "failed":
        return <XCircle className="h-12 w-12 text-red-500" />;
      default:
        return <CreditCard className="h-12 w-12 text-primary-500" />;
    }
  };

  const getStepTitle = () => {
    switch (paymentStep) {
      case "processing":
        return "Processing Payment...";
      case "success":
        return "Payment Successful!";
      case "failed":
        return "Payment Failed";
      default:
        return "Complete Your Payment";
    }
  };

  if (
    paymentStep === "processing" ||
    paymentStep === "success" ||
    paymentStep === "failed"
  ) {
    return (
      <Card>
        <div className="p-8 text-center">
          <div className="flex justify-center mb-4">{getStepIcon()}</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {getStepTitle()}
          </h3>

          {paymentStep === "processing" && (
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we process your payment securely.
            </p>
          )}

          {paymentStep === "success" && (
            <div className="space-y-3">
              <p className="text-gray-600 dark:text-gray-400">
                Your registration for <strong>{eventTitle}</strong> is
                confirmed!
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                You will receive a confirmation email shortly.
              </p>
            </div>
          )}

          {paymentStep === "failed" && (
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                We couldn't process your payment. Please try again or contact
                support.
              </p>
              <Button onClick={() => setPaymentStep("form")} variant="outline">
                Try Again
              </Button>
            </div>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Payment Details
          </h3>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Event:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {eventTitle}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Amount:</span>
              <span className="font-semibold text-xl text-primary-600 dark:text-primary-400">
                ${amount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handlePayment} className="space-y-6">
          {/* Payment Method Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Payment Method
            </label>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="credit_card"
                  checked={paymentMethod === "credit_card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-primary-600"
                />
                <CreditCard className="h-5 w-5 text-gray-400" />
                <span className="text-gray-900 dark:text-white">
                  Credit/Debit Card
                </span>
              </label>
              <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="digital_wallet"
                  checked={paymentMethod === "digital_wallet"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-primary-600"
                />
                <DollarSign className="h-5 w-5 text-gray-400" />
                <span className="text-gray-900 dark:text-white">
                  Digital Wallet
                </span>
              </label>
            </div>
          </div>

          {/* Credit Card Form */}
          {paymentMethod === "credit_card" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                             focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                             focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex items-center space-x-3 pt-4">
            <Button
              type="submit"
              disabled={isProcessing}
              className="flex-1 flex items-center justify-center space-x-2"
            >
              <CreditCard className="h-4 w-4" />
              <span>
                {isProcessing ? "Processing..." : `Pay $${amount.toFixed(2)}`}
              </span>
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isProcessing}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>
    </Card>
  );
};

export default PaymentForm;
