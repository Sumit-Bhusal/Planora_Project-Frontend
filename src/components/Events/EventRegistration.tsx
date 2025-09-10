import React, { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Card from "../UI/Card";
import Button from "../UI/Button";
import PaymentForm from "../Payment/PaymentForm";
import { participationAPI } from "../../services/api/participation";
import { eventsAPI } from "../../services/api/events";
import { useCF } from "../../contexts/CFContext";
import { useNotification } from "../../contexts/NotificationContext";
import { EventDetails } from "../../types/event";

interface EventRegistrationProps {
  eventId: string;
  onRegistrationComplete?: () => void;
  onCancel?: () => void;
}

const EventRegistration: React.FC<EventRegistrationProps> = ({
  eventId,
  onRegistrationComplete,
  onCancel,
}) => {
  const { trackRegistration } = useCF();
  const { addNotification } = useNotification();
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [registrationStatus, setRegistrationStatus] = useState<{
    isRegistered: boolean;
    status: string | null;
  }>({ isRegistered: false, status: null });
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<"details" | "payment" | "success">(
    "details"
  );
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    const loadEventData = async () => {
      try {
        setLoading(true);
        const [eventData, registrationData] = await Promise.all([
          eventsAPI.getEvent(eventId),
          participationAPI.checkRegistration(eventId),
        ]);

        setEvent(eventData);
        setRegistrationStatus(registrationData);
      } catch (error) {
        console.error("Failed to load event data:", error);
        addNotification({
          type: "error",
          title: "Loading Error",
          message: "Failed to load event details. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    loadEventData();
  }, [eventId, addNotification]);

  const handleFreeRegistration = async () => {
    setIsRegistering(true);
    try {
      const response = await participationAPI.register(eventId);

      if (response.success) {
        // Track registration for ML
        await trackRegistration(eventId);

        addNotification({
          type: "success",
          title: "Registration Successful!",
          message: `You've successfully registered for ${event?.title}!`,
        });

        setStep("success");
        onRegistrationComplete?.();
      }
    } catch (error) {
      console.error("Registration failed:", error);
      addNotification({
        type: "error",
        title: "Registration Failed",
        message: "Failed to register for the event. Please try again.",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      // Track registration for ML
      await trackRegistration(eventId);
      setStep("success");
      onRegistrationComplete?.();
    } catch (error) {
      console.error("Failed to track registration:", error);
    }
  };

  if (loading) {
    return (
      <Card>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (!event) {
    return (
      <Card>
        <div className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Event Not Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            The event you're trying to register for could not be found.
          </p>
        </div>
      </Card>
    );
  }

  if (registrationStatus.isRegistered) {
    return (
      <Card>
        <div className="p-6 text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Already Registered
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You're already registered for this event.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Status:{" "}
            <span className="capitalize font-medium">
              {registrationStatus.status}
            </span>
          </p>
        </div>
      </Card>
    );
  }

  if (step === "success") {
    return (
      <Card>
        <div className="p-6 text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Registration Complete!
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            You've successfully registered for <strong>{event.title}</strong>
          </p>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
            <div className="text-sm space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>{new Date(event.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{event.location}</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            You will receive a confirmation email shortly with your ticket
            details.
          </p>
        </div>
      </Card>
    );
  }

  if (step === "payment") {
    return (
      <PaymentForm
        eventId={eventId}
        eventTitle={event.title}
        amount={parseFloat(event.price)}
        onSuccess={handlePaymentSuccess}
        onCancel={() => setStep("details")}
      />
    );
  }

  const isFree = parseFloat(event.price) === 0;
  const isEventFull = event.currentAttendees >= event.maxAttendees;

  return (
    <div className="space-y-6">
      {/* Event Details */}
      <Card>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Register for Event
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {event.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {event.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Date & Time
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(event.startDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Location
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {event.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Capacity
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {event.currentAttendees} / {event.maxAttendees} registered
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Price
                  </p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {isFree ? "Free" : `$${parseFloat(event.price).toFixed(2)}`}
                  </p>
                </div>
              </div>
            </div>

            {isEventFull && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                    This event is fully booked
                  </p>
                </div>
                <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
                  You can join the waitlist to be notified if spots become
                  available.
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Registration Actions */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                Complete Registration
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                {isFree
                  ? "Click register to secure your spot at this free event."
                  : `Pay $${parseFloat(event.price).toFixed(
                      2
                    )} to complete your registration.`}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 mt-6">
            {isFree ? (
              <Button
                onClick={handleFreeRegistration}
                disabled={isRegistering || isEventFull}
                className="flex items-center space-x-2"
              >
                <CheckCircle className="h-4 w-4" />
                <span>
                  {isRegistering ? "Registering..." : "Register for Free"}
                </span>
              </Button>
            ) : (
              <Button
                onClick={() => setStep("payment")}
                disabled={isEventFull}
                className="flex items-center space-x-2"
              >
                <DollarSign className="h-4 w-4" />
                <span>Proceed to Payment</span>
              </Button>
            )}

            {onCancel && (
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EventRegistration;
