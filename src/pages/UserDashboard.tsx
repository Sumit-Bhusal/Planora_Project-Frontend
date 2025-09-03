import React from "react";
import { Calendar, Star, Clock, Heart, Sparkles, Search, Bookmark, Building2, ArrowRight } from "lucide-react";
import Card from "../components/UI/Card";
import Button from "../components/UI/Button";
import EventCard from "../components/Events/EventCard";
import { Link, useNavigate } from "react-router-dom";

const UserDashboard: React.FC<{ user: any; activeTickets: any[]; recommendedEvents: any[]; registerForEvent: any; }> = ({ user, activeTickets, recommendedEvents, registerForEvent }) => {
  const navigate = useNavigate();
  const stats = [
    {
      icon: Calendar,
      label: "Events Attended",
      value: "",
      color: "text-secondary-600 dark:text-secondary-400",
      bgColor: "bg-secondary-50 dark:bg-secondary-900/30",
      description: "Total events",
    },
    {
      icon: Star,
      label: "Favorite Categories",
      value: "",
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/30",
      description: "Interests set",
    },
    {
      icon: Clock,
      label: "Upcoming Events",
      value: "",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/30",
      description: "Active tickets",
    },
    {
      icon: Heart,
      label: "Events Saved",
      value: "",
      color: "text-pink-600 dark:text-pink-400",
      bgColor: "bg-pink-50 dark:bg-pink-900/30",
      description: "Bookmarked",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-blue-50 to-purple-50 dark:from-secondary-900/20 dark:via-blue-900/20 dark:to-purple-900/20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="relative mr-4">
                <Sparkles className="h-8 w-8 text-secondary-600 dark:text-secondary-400 animate-pulse" />
                <div className="absolute inset-0 bg-secondary-600 dark:text-secondary-400 rounded-full opacity-20 animate-ping"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text-primary">Welcome back, {user.name}</h1>
                <p className="mt-2 text-gray-600 dark:text-dark-text-secondary">Discover events tailored to your interests with smart recommendations</p>
              </div>
            </div>
          </div>
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border bg-gradient-to-r from-secondary-100 to-blue-100 dark:from-secondary-900/30 dark:to-blue-900/30 text-secondary-800 dark:text-secondary-300 border-secondary-200 dark:border-secondary-700">
            <Sparkles className="h-4 w-4 mr-2" /> Event Explorer Dashboard
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 hover:scale-105 transition-all duration-300 border-0 shadow-lg" hover>
              <div className="flex items-center">
                <div className={`p-3 rounded-xl ${stat.bgColor} ${stat.color} shadow-sm`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600 dark:text-dark-text-secondary">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary">{stat.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Action Buttons Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Button icon={Search} className="h-16 flex-col space-y-1 bg-gradient-to-r from-secondary-600 to-blue-600 hover:from-secondary-700 hover:to-blue-700 text-white font-bold shadow-lg" onClick={() => navigate('/events')}> <span className="text-xs">Discover</span> <span className="text-sm font-medium">Events</span> </Button>
          <Button variant="outline" icon={Bookmark} className="h-16 flex-col space-y-1 border-secondary-200 dark:border-secondary-700 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-900/30"> <span className="text-xs">Saved</span> <span className="text-sm font-medium">Events</span> </Button>
          <Button variant="outline" icon={Heart} className="h-16 flex-col space-y-1 border-secondary-200 dark:border-secondary-700 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-900/30"> <span className="text-xs">Favorites</span> <span className="text-sm font-medium">Categories</span> </Button>
        </div>

        {/* Recommended Events */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-6 overflow-hidden" >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text-primary flex items-center">
              <Sparkles className="h-5  mr-2 text-secondary-600 dark:text-secondary-400" />
              Recommended for You
            </h3>
            <Link to="/events" className="text-sm font-medium text-secondary-600 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-300 flex items-center space-x-1">
              <span>View All</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {recommendedEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendedEvents.slice(0, 4).map((event) => (
                <EventCard key={event.id} event={event} variant="user" onRegister={() => registerForEvent(event.id)} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center bg-gradient-to-br from-secondary-50 to-blue-50 dark:from-secondary-900/20 dark:to-blue-900/20 border-secondary-200 dark:border-secondary-800 overflow-hidden">
              <div className="relative mb-6 ">
                <Sparkles className="h-16 w-9 text-secondary-400 dark:text-secondary-500 mx-auto animate-float" />
                <div className="absolute inset-0 bg-secondary-400 dark:bg-secondary-500 rounded-full opacity-20 animate-ping w-full "></div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text-primary mb-2">Discover Amazing Events</h3>
              <p className="text-gray-500 dark:text-dark-text-tertiary mb-6">Set your interests to get personalized event recommendations</p>
              <Button icon={Search} className="transform hover:scale-105 transition-all bg-gradient-to-r from-secondary-600 to-blue-600 hover:from-secondary-700 hover:to-blue-700" onClick={() => navigate('/events')}>
                Browse Events
              </Button>
            </Card>
          )}
        </Card>

        {/* Upcoming Events */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text-primary mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-secondary-600 dark:text-secondary-400" />
            Upcoming Events
          </h3>
          <div className="space-y-4">
            {activeTickets.slice(0, 3).map((ticket) => (
              <div key={ticket.id} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div className="w-10 h-10 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-secondary-600 dark:text-secondary-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{ticket.eventTitle}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{ticket.eventDate.toLocaleDateString()}</p>
                </div>
              </div>
            ))}
            {activeTickets.length === 0 && (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">No upcoming events</p>
                <Button variant="outline" size="sm" className="mt-2 border-secondary-200 dark:border-secondary-700 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-900/30" onClick={() => navigate('/events')}>
                  Browse Events
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;