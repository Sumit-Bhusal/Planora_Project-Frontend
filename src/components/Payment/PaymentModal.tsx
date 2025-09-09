import React, { useState } from "react";
import { X, Smartphone, CheckCircle, AlertCircle } from "lucide-react";
import Button from "../UI/Button";
import Card from "../UI/Card";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  purpose: "event_creation" | "ticket_booking";
  onSuccess: () => void;
  eventTitle?: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  purpose,
  onSuccess,
  eventTitle,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<
    "esewa" | "khalti" | null
  >(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success" | "failed"
  >("idle");

  if (!isOpen) return null;

  const handlePayment = async () => {
    if (!selectedMethod) return;

    setIsProcessing(true);
    setPaymentStatus("processing");

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Simulate success (90% success rate)
    const isSuccess = Math.random() > 0.1;

    if (isSuccess) {
      setPaymentStatus("success");
      setTimeout(() => {
        onSuccess();
        onClose();
        setPaymentStatus("idle");
        setSelectedMethod(null);
      }, 2000);
    } else {
      setPaymentStatus("failed");
      setTimeout(() => {
        setPaymentStatus("idle");
        setIsProcessing(false);
      }, 2000);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("ne-NP", {
      style: "currency",
      currency: "NPR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white dark:bg-gray-800">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {purpose === "event_creation"
                ? "Event Creation Fee"
                : "Ticket Payment"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              disabled={isProcessing}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {paymentStatus === "processing" && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">
                Processing payment with {selectedMethod}...
              </p>
            </div>
          )}

          {paymentStatus === "success" && (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-green-600 dark:text-green-400 font-medium">
                Payment Successful!
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                {purpose === "event_creation"
                  ? "Your event will be published shortly."
                  : "Your ticket has been booked successfully."}
              </p>
            </div>
          )}

          {paymentStatus === "failed" && (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 dark:text-red-400 font-medium">
                Payment Failed
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                Please try again or use a different payment method.
              </p>
              <Button
                onClick={() => setPaymentStatus("idle")}
                className="mt-4"
                variant="outline"
              >
                Try Again
              </Button>
            </div>
          )}

          {paymentStatus === "idle" && (
            <>
              {/* Payment Details */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 dark:text-gray-300">
                    {purpose === "event_creation"
                      ? "Event Creation Fee"
                      : "Ticket Price"}
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatAmount(amount)}
                  </span>
                </div>
                {eventTitle && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 dark:text-gray-300">
                      Event
                    </span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {eventTitle}
                    </span>
                  </div>
                )}
                {/* <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">
                    Processing Fee
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {formatAmount(amount * 0.02)}
                  </span>
                </div> */}
                <hr className="my-2 border-gray-200 dark:border-gray-600" />
                <div className="flex justify-between items-center font-semibold">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="text-gray-900 dark:text-white">
                    {formatAmount(amount)}
                  </span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3 mb-6">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Select Payment Method
                </h3>

                {/* eSewa */}
                <button
                  onClick={() => setSelectedMethod("esewa")}
                  className={`w-full p-4 border-2 rounded-lg transition-all ${
                    selectedMethod === "esewa"
                      ? "border-green-500 bg-green-50 dark:bg-green-900/30"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                      <Smartphone className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900 dark:text-white">
                        eSewa
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Digital Wallet
                      </div>
                    </div>
                  </div>
                </button>

                {/* Khalti */}
                {/* <button
                  onClick={() => setSelectedMethod('khalti')}
                  className={`w-full p-4 border-2 rounded-lg transition-all ${
                    selectedMethod === 'khalti'
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900 dark:text-white">Khalti</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Digital Wallet</div>
                    </div>
                  </div>
                </button> */}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePayment}
                  className="flex-1"
                  disabled={!selectedMethod || isProcessing}
                  loading={isProcessing}
                >
                  Pay {formatAmount(amount)}
                </Button>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default PaymentModal;
