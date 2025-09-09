import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
// import PaymentModal from "../../components/Payment/PaymentModal";
import { Calendar, MapPin, User, CreditCard, Sparkles } from "lucide-react";
import { makePayment } from "../../actions/payment/payment";
import { PaymentData } from "../../types/payment";
import { useAuth } from "../../contexts/AuthContext";
import EsewaPayment from "../../components/Payment/EsewaPayment";

const RegisterEventPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const event = location.state?.event;
  const [showPaymentModal, setShowPaymentModal] = React.useState(false);
  const { paymentData, setPaymentData } = useAuth();

  // Always get user info from localStorage
  let user = null;
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  } catch (e) {
    user = null;
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary-100 via-secondary-100 to-purple-100 dark:from-dark-bg-primary dark:via-dark-bg-secondary dark:to-dark-bg-tertiary">
        <Card className="p-8 shadow-2xl rounded-xl bg-white dark:bg-dark-bg-secondary">
          <h2 className="text-2xl font-bold mb-4 text-center text-red-600 dark:text-red-400 flex items-center justify-center">
            <CreditCard className="h-6 w-6 mr-2" /> No event selected
          </h2>
          <Button onClick={() => navigate(-1)} className="w-full mt-4">
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  // Format date and time for better readability
  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return (
      date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }) +
      " at " +
      date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    );
  };

  const bgImage =
    event.imageUrl ??
    "https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";

  const handleProceedToPayment = async () => {
    try {
      const data: PaymentData = {
        amount: event.price,
        paymentMethod: "esewa",
        participationId: paymentData.participationId || "", // Fallback to empty string
        currency: "npr",
      };
      
      console.log("Payment data being sent:", data);
      
      const response = await makePayment(event.id, data);
      console.log("Payment response:", response);
      
      if (response && response.status === "success") {
        setPaymentData({
          signature: response.data?.signature!,
          signedFields: response.data?.signedFields!,
          transactionUUID: response.data?.Payment.transactionUUID!,
          amount: event.price,
          currency: "npr",
          paymentMethod: "esewa",
          participationId: response.data?.Payment.participationId!,
        });
        setShowPaymentModal(true);
      } else {
        console.error("Payment initiation failed:", response);
        // You could add error handling here, like showing a notification
      }
    } catch (error) {
      console.error("Error in handleProceedToPayment:", error);
      // You could add error handling here as well
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen w-full relative"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md z-0" />
      <div className="relative z-10 w-full max-w-3xl mx-auto py-16 px-4 flex flex-col gap-8">
        <div className="flex flex-col items-center mb-4">
          <Sparkles className="h-8 w-8 text-primary-400 animate-pulse mb-2" />
          <h2 className="text-4xl font-extrabold text-center text-white mb-2 tracking-tight drop-shadow-lg">
            Event Registration
          </h2>
          <p className="text-lg text-gray-200 text-center">
            Secure your spot and join the experience!
          </p>
        </div>
        <div className="mb-6 w-full bg-white/80 dark:bg-dark-bg-secondary/80 rounded-xl p-8 border border-primary-100 dark:border-dark-border-primary shadow-lg">
          <h3 className="text-xl font-bold text-primary-700 dark:text-primary-300 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2" /> Event Details
          </h3>
          <div className="space-y-4 text-gray-900 dark:text-dark-text-primary text-lg">
            <div>
              <span className="font-semibold">Title:</span> {event.title}
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-primary-500" />
              <span className="font-semibold">Start:</span>{" "}
              {formatDateTime(event.startDate)}
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-primary-500" />
              <span className="font-semibold">End:</span>{" "}
              {formatDateTime(event.endDate)}
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-primary-500" />
              <span className="font-semibold">Venue:</span> {event.venue},{" "}
              {event.city}
            </div>
            <div>
              <span className="font-semibold">Participation:</span>{" "}
              {event.maxAttendees - event.currentAttendees} spots left
            </div>
            <div className="text-xl font-bold text-green-600 dark:text-green-400 mt-2">
              <CreditCard className="h-4 w-4 mr-1 inline" /> NPR{" "}
              {event.ticketPrice}
            </div>
          </div>
        </div>
        <div className="mb-6 w-full bg-white/80 dark:bg-dark-bg-secondary/80 rounded-xl p-8 border border-secondary-100 dark:border-dark-border-secondary shadow-lg">
          <h3 className="text-xl font-bold text-secondary-700 dark:text-secondary-300 mb-4 flex items-center">
            <User className="h-5 w-5 mr-2" /> Your Details
          </h3>
          <div className="space-y-4 text-gray-900 dark:text-dark-text-primary text-lg">
            <div>
              <span className="font-semibold">Name:</span> {user?.name}
            </div>
            <div>
              <span className="font-semibold">Email:</span> {user?.email}
            </div>
          </div>
        </div>
        <Button
          className="w-full py-4 text-xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white rounded-xl shadow-lg transform hover:scale-105 transition-all mt-4"
          onClick={() => handleProceedToPayment()}
          icon={CreditCard}
        >
          Proceed to Payment
        </Button>
        {/* <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          amount={Number(event.ticketPrice)}
          purpose="ticket_booking"
          onSuccess={() => {
            setShowPaymentModal(false);
          }}
          eventTitle={event.title}
        /> */}
        <EsewaPayment
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            setShowPaymentModal(false);
          }}
        />
      </div>
    </div>
  );
};

export default RegisterEventPage;
