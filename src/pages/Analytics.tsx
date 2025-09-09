import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useEvents } from "../contexts/EventContext";
import {
  BarChart3,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  Target,
  Zap,
  Activity,
  Download,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import Card from "../components/UI/Card";
import Button from "../components/UI/Button";
import { analyticsAPI, OrganizerAnalytics } from "../services/api/analytics";

const Analytics: React.FC = () => {
  const { user } = useAuth();
  const { events } = useEvents();
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">(
    "30d"
  );
  const [analyticsData, setAnalyticsData] = useState<OrganizerAnalytics | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user || user.role !== "organizer") return;

      try {
        setLoading(true);
        const data = await analyticsAPI.getOrganizerAnalytics();
        setAnalyticsData(data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user]);

  if (!user || user.role !== "organizer") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg-primary flex items-center justify-center">
        <Card className="p-8 text-center">
          <Zap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Analytics are only available for event organizers.
          </p>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg-primary flex items-center justify-center">
        <Card className="p-8 text-center">
          <Activity className="h-16 w-16 text-primary-600 mx-auto mb-4 animate-spin" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Loading Analytics
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we fetch your data...
          </p>
        </Card>
      </div>
    );
  }

  if (error || !analyticsData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg-primary flex items-center justify-center">
        <Card className="p-8 text-center">
          <Zap className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Error Loading Analytics
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {error || "Unable to load analytics data"}
          </p>
        </Card>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Events",
      value: analyticsData.summary.totalEvents.toString(),
      icon: Calendar,
      color: "text-primary-600 dark:text-primary-400",
      bgColor: "bg-primary-50 dark:bg-primary-900/30",
      trend: `${analyticsData.summary.upcomingEvents} upcoming`,
      trendDirection: "up" as const,
    },
    {
      label: "Total Registrations",
      value: analyticsData.summary.totalRegistrations.toString(),
      icon: Users,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-900/30",
      trend: `${analyticsData.summary.totalAttended} attended`,
      trendDirection: "up" as const,
    },
    {
      label: "Total Revenue",
      value: `Rs ${analyticsData.summary.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/30",
      trend: `Rs ${Math.round(
        analyticsData.summary.averageRevenuePerEvent
      ).toLocaleString()} avg/event`,
      trendDirection: "up" as const,
    },
    {
      label: "Avg. Attendance Rate",
      value: `${Math.round(analyticsData.summary.averageAttendanceRate)}%`,
      icon: TrendingUp,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-900/30",
      trend: `${analyticsData.summary.totalAttended}/${analyticsData.summary.totalRegistrations} attended`,
      trendDirection: "up" as const,
    },
  ];
  const topEvents = [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-purple-50 to-blue-50 dark:from-primary-900/20 dark:via-purple-900/20 dark:to-blue-900/20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="relative mr-4">
                <BarChart3 className="h-8 w-8 text-primary-600 dark:text-primary-400 animate-pulse" />
                <div className="absolute inset-0 bg-primary-600 dark:text-primary-400 rounded-full opacity-20 animate-ping"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Event Analytics
                </h1>
                <p className="text-gray-700 dark:text-gray-300 mt-2">
                  Track your event performance and gain insights to improve
                  future events
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-3">
              <select
                value={timeRange}
                onChange={(e) =>
                  setTimeRange(e.target.value as "7d" | "30d" | "90d" | "1y")
                }
                className="px-3 py-2 border border-primary-200 dark:border-primary-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <Button
                variant="outline"
                icon={Download}
                size="sm"
                className="border-primary-200 dark:border-primary-700 text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30"
              >
                Export Report
              </Button>
            </div>
          </div>

          {/* Role Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-primary-100 to-purple-100 dark:from-primary-900/30 dark:to-purple-900/30 text-primary-800 dark:text-primary-300 border border-primary-200 dark:border-primary-700">
            <Zap className="h-4 w-4 mr-2" />
            Organizer Analytics Dashboard
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
              <div className="flex items-center justify-between">
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
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    {stat.trendDirection === "up" ? (
                      <ArrowUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <ArrowUp className="h-4 w-4 text-red-600 dark:text-red-400 rotate-180" />
                    )}
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      {stat.trend}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Registration Trends Card */}
            <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-primary-200 dark:border-primary-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                  Registration Trends
                </h3>
                <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                  <BarChart3 className="h-5 w-5" />
                  <span className="text-sm">
                    Last{" "}
                    {timeRange === "7d"
                      ? "7"
                      : timeRange === "30d"
                      ? "30"
                      : timeRange === "90d"
                      ? "90"
                      : "365"}{" "}
                    days
                  </span>
                </div>
              </div>
              <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Registration trends chart would be implemented here
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    Showing registration patterns over{" "}
                    {timeRange === "7d"
                      ? "7"
                      : timeRange === "30d"
                      ? "30"
                      : timeRange === "90d"
                      ? "90"
                      : "365"}{" "}
                    days
                  </p>
                </div>
              </div>
            </Card>
            {/* Top Performing Events Card */}
            <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-primary-200 dark:border-primary-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <Target className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                  Top Performing Events
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary-200 dark:border-primary-700 text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30"
                >
                  View All Events
                </Button>
              </div>
              <div className="space-y-4">
                <div className="text-center text-gray-400 dark:text-gray-600 py-8">
                  No top performing events to display.
                </div>
              </div>
            </Card>
          </div>
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Insights */}
            <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-primary-200 dark:border-primary-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                Quick Insights
              </h3>
              <div className="space-y-4">
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center space-x-2">
                    <ArrowUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-green-800 dark:text-green-300">
                      Growth Trend
                    </span>
                  </div>
                  <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                    -
                  </p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                      Audience Engagement
                    </span>
                  </div>
                  <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                    -
                  </p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm font-medium text-purple-800 dark:text-purple-300">
                      Revenue Growth
                    </span>
                  </div>
                  <p className="text-xs text-purple-700 dark:text-purple-400 mt-1">
                    -
                  </p>
                </div>
              </div>
            </Card>

            {/* Individual Event Performance */}
            <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-primary-200 dark:border-primary-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                Event Performance
              </h3>
              <div className="space-y-4">
                {analyticsData.eventAnalytics.slice(0, 5).map((event) => (
                  <div
                    key={event.eventId}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                        {event.eventTitle}
                      </h4>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {event.totalRegistrations} registrations
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            Rs {event.totalRevenue.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="h-4 w-4 text-orange-600" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {Math.round(event.attendanceRate)}% attendance
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          event.attendanceRate >= 80
                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                            : event.attendanceRate >= 60
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                        }`}
                      >
                        {event.attendanceRate >= 80
                          ? "Excellent"
                          : event.attendanceRate >= 60
                          ? "Good"
                          : "Needs Improvement"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recommendations */}
            <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-primary-200 dark:border-primary-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                Recommendations
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-300 text-sm">
                    Optimize Pricing
                  </h4>
                  <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                    -
                  </p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-medium text-blue-800 dark:text-blue-300 text-sm">
                    Increase Promotion
                  </h4>
                  <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                    -
                  </p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-medium text-green-800 dark:text-green-300 text-sm">
                    Expand Categories
                  </h4>
                  <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                    -
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Individual Event Analytics Modal (future implementation) */}
      </div>
    </div>
  );
};

export default Analytics;
