import React from "react";
import { AlertCircle } from "lucide-react";
import Button from "../UI/Button";
import { useNavigate } from "react-router-dom";

const FailedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center text-center p-4">
      <div className="max-w-md w-full">
        <AlertCircle className="h-20 w-20 text-red-500 mx-auto mb-6" />
        <h1 className="text-3xl font-extrabold text-red-600 dark:text-red-400 mb-3">
          Payment Failed
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Unfortunately, your payment could not be processed at this time.
          Please try again later.
        </p>
        <Button
          variant="primary"
          className="w-full max-w-xs mx-auto"
          onClick={() => navigate("/")}
        >
          Go to Home
        </Button>
      </div>
    </div>
  );
};

export default FailedPage;
