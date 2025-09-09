import React, { useEffect, useState, useRef } from "react";
import { CheckCircle, Loader } from "lucide-react";
import Button from "../UI/Button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyPayment } from "../../actions/payment/payment"; // Assuming verifyPayment is in this path

const SuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const hasCalledApi = useRef(false);

  useEffect(() => {
    if (hasCalledApi.current) return;
    hasCalledApi.current = true;

    const data = searchParams.get("data");

    if (data) {
      const updateStatus = async () => {
        try {
          const decodedData = JSON.parse(atob(data));
          const transactionId = decodedData.transaction_uuid;
          const amount = parseInt(decodedData.total_amount);

          const response = await verifyPayment(transactionId, amount);

          if (response?.status === "success") {
            setVerified(true);
          } else {
            navigate("/failure");
          }
        } catch (error) {
          console.error("Payment verification failed:", error);
          navigate("/failure");
        } finally {
          setLoading(false);
        }
      };

      updateStatus();
    } else if (searchParams.get("verified") === "true") {
      setVerified(true);
      setLoading(false);
    } else {
      // Handle cases where there's no data (e.g., direct navigation)
      setLoading(false);
      navigate("/");
    }
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center text-center p-4">
      <div className="max-w-md w-full">
        {loading ? (
          <>
            <Loader className="h-20 w-20 text-primary-500 mx-auto mb-6 animate-spin" />
            <h1 className="text-3xl font-extrabold text-gray-800 dark:text-gray-200 mb-3">
              Verifying Payment...
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Please wait while we confirm your transaction.
            </p>
          </>
        ) : verified ? (
          <>
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-extrabold text-green-600 dark:text-green-400 mb-3">
              Payment Successful!
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Thank you! Your payment has been processed successfully.
            </p>
            <div className="space-y-4">
              <Button
                variant="primary"
                className="w-full max-w-xs mx-auto"
                onClick={() => navigate("/my-tickets")}
              >
                View My Tickets
              </Button>
              <Button
                variant="outline"
                className="w-full max-w-xs mx-auto"
                onClick={() => navigate("/")}
              >
                Go to Home
              </Button>
            </div>
          </>
        ) : (
          // This part is a fallback, though users should be redirected to /failure
          <p className="text-lg text-red-600 dark:text-red-400">
            Payment could not be verified.
          </p>
        )}
      </div>
    </div>
  );
};

export default SuccessPage;
