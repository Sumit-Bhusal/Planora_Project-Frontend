import React from "react";
import { AlertCircle } from "lucide-react";
import Card from "../UI/Card";
import Button from "../UI/Button";
import { useNavigate } from "react-router-dom";

const FailedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white dark:bg-gray-800">
        <div className="p-8 text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
            Payment Failed
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Sorry, your payment could not be processed.
            <br />
            Please check your payment details or try again.
          </p>
          <Button
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md font-semibold"
            onClick={() => navigate(-1)}
          >
            Try Again
          </Button>
          <Button
            variant="outline"
            className="w-full mt-3"
            onClick={() => navigate("/")}
          >
            Go to Home
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default FailedPage;
