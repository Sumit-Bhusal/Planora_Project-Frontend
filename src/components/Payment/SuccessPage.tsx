import React from "react";
import { CheckCircle } from "lucide-react";
import Card from "../UI/Card";
import Button from "../UI/Button";
import { useNavigate } from "react-router-dom";

const SuccessPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white dark:bg-gray-800">
        <div className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
            Payment Successful!
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Thank you! Your payment has been processed successfully.
            <br />
            You will receive a confirmation email soon.
          </p>
          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold"
            onClick={() => navigate("/user-tickets")}
          >
            View My Tickets
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

export default SuccessPage;
