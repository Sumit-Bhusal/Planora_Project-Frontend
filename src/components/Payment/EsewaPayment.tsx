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

  // Data from context, mapped to eSewa fields
  const amount = paymentData.amount.toString();
  const taxAmount = "0"; // Assuming no tax for now
  const totalAmount = paymentData.amount.toString();
  const transactionUuid = paymentData.transactionUUID;
  const productCode = "EPAYTEST";
  const productServiceCharge = "0";
  const productDeliveryCharge = "0";
  const successUrl = `${window.location.origin}/success`;
  const failureUrl = `${window.location.origin}/failure`;
  const signedFieldNames = paymentData.signedFields;
  const signature = paymentData.signature;

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    setIsProcessing(true);
  };

  console.log(signature);

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
              <span className="text-2xl">×</span>
            </button>
          </div>

          <form
            id="esewa-form"
            action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
            method="POST"
            onSubmit={handleSubmit}
          >
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <div className="flex flex-row justify-between">
                <div className="px-6 py-3 text-lg font-bold text-gray-900 dark:text-white">
                  Total
                </div>
                <div className="px-6 py-3 font-bold dark:text-white">
                  रु {totalAmount}
                </div>
              </div>
            </div>

            {/* Hidden fields for eSewa payment */}
            <table className="hidden">
              <tbody>
                <tr>
                  <td>Amount</td>
                  <td>
                    <input type="text" name="amount" value={amount} readOnly />
                  </td>
                </tr>
                <tr>
                  <td>Tax Amount</td>
                  <td>
                    <input
                      type="text"
                      name="tax_amount"
                      value={taxAmount}
                      readOnly
                    />
                  </td>
                </tr>
                <tr>
                  <td>Total Amount</td>
                  <td>
                    <input
                      type="text"
                      name="total_amount"
                      value={totalAmount}
                      readOnly
                    />
                  </td>
                </tr>
                <tr>
                  <td>Transaction UUID</td>
                  <td>
                    <input
                      type="text"
                      name="transaction_uuid"
                      value={transactionUuid}
                      readOnly
                    />
                  </td>
                </tr>
                <tr>
                  <td>Product Code</td>
                  <td>
                    <input
                      type="text"
                      name="product_code"
                      value={productCode}
                      readOnly
                    />
                  </td>
                </tr>
                <tr>
                  <td>Product Service Charge</td>
                  <td>
                    <input
                      type="text"
                      name="product_service_charge"
                      value={productServiceCharge}
                      readOnly
                    />
                  </td>
                </tr>
                <tr>
                  <td>Product Delivery Charge</td>
                  <td>
                    <input
                      type="text"
                      name="product_delivery_charge"
                      value={productDeliveryCharge}
                      readOnly
                    />
                  </td>
                </tr>
                <tr>
                  <td>Success URL</td>
                  <td>
                    <input
                      type="text"
                      name="success_url"
                      value={successUrl}
                      readOnly
                    />
                  </td>
                </tr>
                <tr>
                  <td>Failure URL</td>
                  <td>
                    <input
                      type="text"
                      name="failure_url"
                      value={failureUrl}
                      readOnly
                    />
                  </td>
                </tr>
                <tr>
                  <td>Signed Field Names</td>
                  <td>
                    <input
                      type="text"
                      name="signed_field_names"
                      value={signedFieldNames}
                      readOnly
                    />
                  </td>
                </tr>
                <tr>
                  <td>Signature</td>
                  <td>
                    <input
                      type="text"
                      name="signature"
                      value={signature}
                      readOnly
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="mt-6 flex justify-center">
              <Button
                type="submit"
                className="flex-1 bg-[#1B5240] text-white px-6 py-2 rounded-md hover:bg-green-600"
                disabled={isProcessing}
                loading={isProcessing}
              >
                Pay with eSewa
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default EsewaPayment;
