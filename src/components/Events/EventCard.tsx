import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  // Tag,
  Edit,
  BarChart3,
  Share2,
  Trash2,
  // MoreVertical,
} from "lucide-react";
import { Event } from "../../types";
import Card from "../UI/Card";
import Button from "../UI/Button";
import { useNavigate } from "react-router-dom";
import { useEvents } from "../../contexts/EventContext";
import { registerForEvent } from "../../actions/event/event";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext";

interface EventCardProps {
  event: Event;
  onRegister?: () => void;
  onEdit?: () => void;
  onViewAnalytics?: () => void;
  onShare?: () => void;
  showActions?: boolean;
  variant?: "user" | "organizer";
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  onEdit,
  onViewAnalytics,
  onShare,
  showActions = true,
  variant,
}) => {
  // Remove booking modal state
  const { deleteEvent, startEditingEvent } = useEvents();
  const { setPaymentData } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  // Default to user variant if not specified
  const cardVariant = variant || "user";

  // Debug price
  console.log(`EventCard for ${event.title} - ticketPrice:`, event.ticketPrice, typeof event.ticketPrice);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getAvailabilityColor = () => {
    const availability =
      ((event.maxAttendees - event.currentAttendees) / event.maxAttendees) *
      100;
    if (availability > 50) return "text-green-600 dark:text-green-400";
    if (availability > 20) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const handleRegisterClick = async () => {
    try {
      const response = await registerForEvent(event.id);
      if (response) {
        setPaymentData({
          participationId: response.id,
          amount: event.ticketPrice ?? 0,
          currency: "npr",
          paymentMethod: "esewa",
          signature: "",
          signedFields: "",
          transactionUUID: "",
        });
        
        addNotification({
          type: 'success',
          title: 'Registration Started',
          message: 'Proceeding to payment...'
        });
        
        navigate("/events/register", { state: { event } });
      } else {
        navigate("/events");
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      
      addNotification({
        type: 'error',
        title: 'Registration Failed',
        message: error.message || 'Failed to register for event'
      });
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this event? This action cannot be undone."
      )
    ) {
      await deleteEvent(event.id);
    }
  };

  return (
    <>
      <Card
        className={`overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 ${
          cardVariant === "organizer"
            ? "border-primary-200 dark:border-primary-700"
            : ""
        }`}
        hover
      >
        <div className="relative">
          <img
            src={
              event.imageUrl ??
              "https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            }
            alt={event.title}
            className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-4 right-4">
            <div className="bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
              NPR{" "}
              {event.ticketPrice !== undefined &&
              !isNaN(Number(event.ticketPrice))
                ? Number(event.ticketPrice).toLocaleString()
                : ""}
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-2">
              {event.title}
            </h3>
            {cardVariant === "organizer" && (
              <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                <Users className="h-4 w-4" />
                <span>
                  {event.currentAttendees}/{event.maxAttendees}
                </span>
              </div>
            )}
          </div>

          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
            {event.description}
          </p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="h-4 w-4 mr-2 text-primary-500 dark:text-primary-400" />
              <span>
                {formatDate(new Date(event.startDate))} -{" "}
                {formatDate(new Date(event.endDate))}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <MapPin className="h-4 w-4 mr-2 text-primary-500 dark:text-primary-400" />
              <span>
                {event.city}, {event.venue}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold mr-1">Venue Type:</span>{" "}
              {event.venueType}
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Users className="h-4 w-4 mr-2 text-primary-500 dark:text-primary-400" />
              <span className={getAvailabilityColor()}>
                {cardVariant === "organizer"
                  ? `${event.currentAttendees} registered`
                  : `${event.maxAttendees - event.currentAttendees} spots left`}
              </span>
            </div>
            {cardVariant === "organizer" && (
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <DollarSign className="h-4 w-4 mr-2 text-primary-500 dark:text-primary-400" />
                <span>
                  Revenue: NPR{" "}
                  {event.ticketPrice !== undefined &&
                  event.currentAttendees !== undefined &&
                  !isNaN(Number(event.ticketPrice)) &&
                  !isNaN(Number(event.currentAttendees))
                    ? (
                        Number(event.currentAttendees) *
                        Number(event.ticketPrice)
                      ).toLocaleString()
                    : ""}
                </span>
              </div>
            )}
          </div>

          {showActions && (
            <div className="flex space-x-2">
              {cardVariant === "user" ? (
                <Button
                  onClick={handleRegisterClick}
                  className="flex-1 transform hover:scale-105 transition-all"
                  disabled={event.currentAttendees >= event.maxAttendees}
                >
                  {event.currentAttendees >= event.maxAttendees
                    ? "Sold Out"
                    : "Register Now"}
                </Button>
              ) : (
                <div className="flex space-x-2 w-full">
                  <Button
                    onClick={
                      onEdit
                        ? () => onEdit()
                        : () => {
                            startEditingEvent(event);
                            navigate("/create-event");
                          }
                    }
                    variant="outline"
                    size="sm"
                    className="flex-1 transform hover:scale-105 transition-all border-primary-200 dark:border-primary-700 text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    onClick={onViewAnalytics}
                    variant="outline"
                    size="sm"
                    className="flex-1 transform hover:scale-105 transition-all border-primary-200 dark:border-primary-700 text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30"
                  >
                    <BarChart3 className="h-4 w-4 mr-1" />
                    Analytics
                  </Button>
                  <Button
                    onClick={onShare}
                    variant="outline"
                    size="sm"
                    className="transform hover:scale-105 transition-all border-primary-200 dark:border-primary-700 text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={handleDelete}
                    variant="outline"
                    size="sm"
                    className="transform hover:scale-105 transition-all border-primary-200 dark:border-primary-700 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Removed Ticket Booking Modal for registration redirect */}
    </>
  );
};

export default EventCard;
