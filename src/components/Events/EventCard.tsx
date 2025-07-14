import React, { useState } from "react";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  // Tag,
  Edit,
  BarChart3,
  Share2,
  // MoreVertical,
} from "lucide-react";
import { Event } from "../../types";
import Card from "../UI/Card";
import Button from "../UI/Button";
import TicketBookingModal from "../Tickets/TicketBookingModal";

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
  onRegister,
  onEdit,
  onViewAnalytics,
  onShare,
  showActions = true,
  variant = "user",
}) => {
  const [showBookingModal, setShowBookingModal] = useState(false);

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

  // const getStatusColor = () => {
  //   switch (event.status) {
  //     case "published":
  //       return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700";
  //     case "draft":
  //       return "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700";
  //     case "cancelled":
  //       return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-700";
  //     case "completed":
  //       return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700";
  //     default:
  //       return "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700";
  //   }
  // };

  const handleRegisterClick = () => {
    setShowBookingModal(true);
  };

  const handleBookingComplete = () => {
    if (onRegister) {
      onRegister();
    }
  };

  return (
    <>
      <Card
        className={`overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 ${
          variant === "organizer"
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
          <div className="absolute top-4 left-4 flex space-x-2">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-700">
              {event.category}
            </div>
            {/* {variant === 'organizer' && (
              <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor()}`}>
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </div>
            )} */}
          </div>
          <div className="absolute top-4 right-4">
            <div className="bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
              NPR {event.price.toLocaleString()}
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-2">
              {event.title}
            </h3>
            {variant === "organizer" && (
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
              <span>{formatDate(new Date(event.startDate))}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <MapPin className="h-4 w-4 mr-2 text-primary-500 dark:text-primary-400" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Users className="h-4 w-4 mr-2 text-primary-500 dark:text-primary-400" />
              <span className={getAvailabilityColor()}>
                {variant === "organizer"
                  ? `${event.currentAttendees} registered`
                  : `${event.maxAttendees - event.currentAttendees} spots left`}
              </span>
            </div>
            {variant === "organizer" && (
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <DollarSign className="h-4 w-4 mr-2 text-primary-500 dark:text-primary-400" />
                <span>
                  Revenue: NPR{" "}
                  {(
                    event.currentAttendees * Number(event.price)
                  ).toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* {event.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {event.tags.slice(0, 3).map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs border border-gray-200 dark:border-gray-600"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  <span>{tag}</span>
                </div>
              ))}
              {event.tags.length > 3 && (
                <div className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs border border-gray-200 dark:border-gray-600">
                  +{event.tags.length - 3}
                </div>
              )}
            </div>
          )} */}

          {showActions && (
            <div className="flex space-x-2">
              {variant === "user" ? (
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
                    onClick={onEdit}
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
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Ticket Booking Modal */}
      <TicketBookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        event={event}
        onBookingComplete={handleBookingComplete}
      />
    </>
  );
};

export default EventCard;
