import React from "react";
import {
  Calendar,
  Users,
  BarChart3,
  TrendingUp,
  Plus,
  Sparkles,
  Settings,
  Bell,
  Share2,
  Building2,
  Activity,
  ArrowRight,
} from "lucide-react";
import Card from "../components/UI/Card";
import Button from "../components/UI/Button";
import EventCard from "../components/Events/EventCard";
import { Link, useNavigate } from "react-router-dom";
import { useEvents } from "../contexts/EventContext";

const OrganizerDashboard: React.FC<{
  user: any;
  organizerEvents: any[];
  handleManageAttendees: any;
  handleShareEvents: any;
  handleEventEdit: any;
  handleEventAnalytics: any;
  handleEventShare: any;
}> = ({
  user,
  organizerEvents,
  handleManageAttendees,
  handleShareEvents,
  handleEventEdit,
  handleEventAnalytics,
  handleEventShare,
}) => {
  const navigate = useNavigate();
  const { stopEditingEvent } = useEvents();
  const stats = [
    {
      icon: Calendar,
      label: "Total Events",
      value: organizerEvents.length.toString(),
      color: "text-primary-600 dark:text-primary-400",
      bgColor: "bg-primary-50 dark:bg-primary-900/30",
      description: "Events created",
    },
    {
      icon: Users,
      label: "Total Attendees",
      value: organizerEvents
        .reduce((sum, event) => sum + event.currentAttendees, 0)
        .toString(),
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/30",
      description: "People registered",
    },
    {
      icon: BarChart3,
      label: "Revenue",
      value: `NPR ${organizerEvents
        .reduce(
          (sum, event) =>
            sum + Number(event.currentAttendees) * Number(event.price),
          0
        )
        .toLocaleString()}`,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/30",
      description: "Total earnings",
    },
    {
      icon: TrendingUp,
      label: "Avg. Attendance",
      value:
        organizerEvents.length > 0
          ? `${Math.round(
              (organizerEvents.reduce(
                (sum, event) =>
                  sum + event.currentAttendees / event.maxAttendees,
                0
              ) /
                organizerEvents.length) *
                100
            )}%`
          : "",
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-900/30",
      description: "Capacity utilization",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-purple-50 to-blue-50 dark:from-primary-900/20 dark:via-purple-900/20 dark:to-blue-900/20 transition-colors duration-300 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="relative mr-4 ">
                <Sparkles className="h-8 w-4 text-secondary-600 dark:text-secondary-400 animate-pulse" />
                <div className="absolute inset-0 bg-secondary-600 dark:text-secondary-400 rounded-full opacity-20 animate-ping"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text-primary">
                  Welcome back, {user.name}
                </h1>
                <p className="mt-2 text-gray-600 dark:text-dark-text-secondary">
                  Manage your events and track their performance with AI-powered
                  insights
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                icon={Bell}
                size="sm"
                className="border-primary-200 dark:border-primary-700 text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30"
              >
                Notifications
              </Button>
              <Button
                variant="outline"
                icon={Settings}
                size="sm"
                className="border-primary-200 dark:border-primary-700 text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30"
              >
                Settings
              </Button>
            </div>
          </div>
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border bg-gradient-to-r from-secondary-100 to-blue-100 dark:from-secondary-900/30 dark:to-blue-900/30 text-secondary-800 dark:text-secondary-300 border-secondary-200 dark:border-secondary-700">
            <Sparkles className="h-4 w-4 mr-2" /> Event Organizer Dashboard
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="p-6 hover:scale-105 transition-all duration-300 border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
              hover
            >
              <div className="flex items-center">
                <div
                  className={`p-3 rounded-xl ${stat.bgColor} ${stat.color} shadow-sm`}
                >
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {stat.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Action Buttons Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Button
            icon={Plus}
            className="h-16 flex-col space-y-1 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700"
            onClick={() => {
              stopEditingEvent();
              navigate("/create-event");
            }}
          >
            {" "}
            <span className="text-xs">Create</span>{" "}
            <span className="text-sm font-medium">New Event</span>{" "}
          </Button>
          <Button
            variant="outline"
            icon={BarChart3}
            className="h-16 flex-col space-y-1 border-primary-200 dark:border-primary-700 text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30"
            onClick={() => navigate("/analytics")}
          >
            {" "}
            <span className="text-xs">View</span>{" "}
            <span className="text-sm font-medium">Analytics</span>{" "}
          </Button>
          <Button
            variant="outline"
            icon={Users}
            className="h-16 flex-col space-y-1 border-primary-200 dark:border-primary-700 text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30"
            onClick={handleManageAttendees}
          >
            {" "}
            <span className="text-xs">Manage</span>{" "}
            <span className="text-sm font-medium">Attendees</span>{" "}
          </Button>
          <Button
            variant="outline"
            icon={Share2}
            className="h-16 flex-col space-y-1 border-primary-200 dark:border-primary-700 text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30"
            onClick={handleShareEvents}
          >
            {" "}
            <span className="text-xs">Share</span>{" "}
            <span className="text-sm font-medium">Events</span>{" "}
          </Button>
        </div>

        {/* Recent Events */}
        <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-primary-200 dark:border-primary-700 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center text-gray-900 dark:text-white">
              <Building2 className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />{" "}
              Your Events
            </h3>
            <Link
              to="/events"
              className="text-sm font-medium flex items-center space-x-1 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
            >
              <span>View All</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {organizerEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {organizerEvents.slice(0, 4).map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  variant="organizer"
                  onEdit={() => handleEventEdit(event)}
                  onViewAnalytics={() => handleEventAnalytics(event)}
                  onShare={() => handleEventShare(event)}
                />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 border-primary-200 dark:border-primary-800">
              <div className="relative mb-6">
                <Calendar className="h-16 w-16 text-primary-400 dark:text-primary-500 mx-auto animate-float" />
                <div className="absolute inset-0 bg-primary-400 dark:bg-primary-500 rounded-full opacity-20 animate-ping"></div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text-primary mb-2">
                Ready to create your first event?
              </h3>
              <p className="text-gray-500 dark:text-dark-text-tertiary mb-6">
                Start building your audience with our AI-powered event creation
                tools
              </p>
              <Button
                icon={Plus}
                className="transform hover:scale-105 transition-all bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700"
                onClick={() => {
                  stopEditingEvent();
                  navigate("/create-event");
                }}
              >
                Create Your First Event
              </Button>
            </Card>
          )}
        </Card>

        {/* Recent Activity */}
        <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-primary-200 dark:border-primary-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900 dark:text-white">
            <Activity className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />{" "}
            Recent Activity
          </h3>
          <div className="space-y-4">{/* No recent activity data */}</div>
        </Card>
      </div>
    </div>
  );
};

export default OrganizerDashboard;