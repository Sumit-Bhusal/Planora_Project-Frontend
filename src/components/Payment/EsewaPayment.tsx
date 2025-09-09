import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Card from "../UI/Card";
import Button from "../UI/Button";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const EsewaPayment: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {
  const { paymentData } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  // Example values, replace with dynamic values as needed
  const [amount] = useState(paymentData.amount);
  const [taxAmount] = useState(0);
  const [totalAmount] = useState(paymentData.amount);
  const [transactionUuid] = useState(paymentData.transactionUUID);
  const [productCode] = useState("EPAYTEST");
  const [productServiceCharge] = useState("0");
  const [productDeliveryCharge] = useState("0");
  const [successUrl] = useState("https://localhost:5173/success");
  const [failureUrl] = useState("https://localhost:5173/failure");
  const [signedFieldNames] = useState(paymentData.signedFields);
  const [signature] = useState(paymentData.signature);

  console.log(paymentData, "---");

  if (!isOpen) return null;

  const handlePay = () => {
    setIsProcessing(true);
    onClose();
    document
      .getElementById("esewa-form")
      ?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white dark:bg-gray-800">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              eSewa Payment
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              disabled={isProcessing}
            >
              <span className="text-2xl">X</span>
            </button>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 dark:text-gray-300">Amount</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                रु {paymentData.amount}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 dark:text-gray-300">
                Transaction ID
              </span>
              <span className="text-sm text-gray-900 dark:text-white">
                {transactionUuid}
              </span>
            </div>
            <hr className="my-2 border-gray-200 dark:border-gray-600" />
            <div className="flex justify-between items-center font-semibold">
              <span className="text-gray-900 dark:text-white">Total</span>
              <span className="text-gray-900 dark:text-white">
                रु {paymentData.amount}
              </span>
            </div>
          </div>
          <form
            id="esewa-form"
            action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
            method="POST"
            className="hidden"
          >
            <input type="hidden" name="amount" value={amount} />
            <input type="hidden" name="tax_amount" value={taxAmount} />
            <input type="hidden" name="total_amount" value={totalAmount} />
            <input
              type="hidden"
              name="transaction_uuid"
              value={transactionUuid}
            />
            <input type="hidden" name="product_code" value={productCode} />
            <input
              type="hidden"
              name="product_service_charge"
              value={productServiceCharge}
            />
            <input
              type="hidden"
              name="product_delivery_charge"
              value={productDeliveryCharge}
            />
            <input type="hidden" name="success_url" value={successUrl} />
            <input type="hidden" name="failure_url" value={failureUrl} />
            <input
              type="hidden"
              name="signed_field_names"
              value={signedFieldNames}
            />
            <input type="hidden" name="signature" value={signature} />
          </form>
          <div className="flex space-x-3 mt-6">
            <Button
              onClick={handlePay}
              className="flex-1"
              disabled={isProcessing}
              loading={isProcessing}
            >
              Pay रु {paymentData.amount}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EsewaPayment;
