import React from 'react';
import { BarChart3, Users, DollarSign, TrendingUp, Eye, Share2, Calendar, MapPin } from 'lucide-react';
import Card from '../UI/Card';

interface EventAnalyticsProps {
  event: {
    id: string;
    title: string;
    views: number;
    registrations: number;
    revenue: number;
    capacity: number;
    date: Date;
    location: string;
  };
}

const EventAnalytics: React.FC<EventAnalyticsProps> = ({ event }) => {
  const registrationRate = ((event.registrations / event.views) * 100).toFixed(1);
  const occupancyRate = ((event.registrations / event.capacity) * 100).toFixed(1);
  const revenuePerRegistration = event.revenue / event.registrations;

  const stats = [
    {
      label: 'Total Views',
      value: event.views.toLocaleString(),
      icon: Eye,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      label: 'Registrations',
      value: event.registrations.toLocaleString(),
      icon: Users,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      label: 'Revenue',
      value: `$${event.revenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      label: 'Registration Rate',
      value: `${registrationRate}%`,
      icon: TrendingUp,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    }
  ];

  const insights = [
    {
      title: 'Occupancy Rate',
      value: `${occupancyRate}%`,
      description: `${event.registrations} of ${event.capacity} spots filled`,
      status: parseFloat(occupancyRate) > 80 ? 'success' : parseFloat(occupancyRate) > 50 ? 'warning' : 'info'
    },
    {
      title: 'Revenue per Registration',
      value: `$${revenuePerRegistration.toFixed(2)}`,
      description: 'Average revenue per attendee',
      status: 'info'
    },
    {
      title: 'Days Until Event',
      value: Math.ceil((event.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
      description: 'Time remaining to promote',
      status: 'info'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
      case 'info':
        return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Event Analytics
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Insights and performance metrics for "{event.title}"
          </p>
        </div>
        <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
          <Calendar className="h-4 w-4" />
          <span className="text-sm">
            {event.date.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {insights.map((insight, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {insight.title}
                </h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {insight.value}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(insight.status)}`}>
                {insight.status}
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {insight.description}
            </p>
          </Card>
        ))}
      </div>

      {/* Performance Chart Placeholder */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Registration Trends
          </h3>
          <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
            <BarChart3 className="h-5 w-5" />
            <span className="text-sm">Last 30 days</span>
          </div>
        </div>
        
        {/* Placeholder for chart */}
        <div className="h-64 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Chart visualization would be implemented here
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Showing registration trends over time
            </p>
          </div>
        </div>
      </Card>

      {/* Recommendations */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recommendations
        </h3>
        <div className="space-y-4">
          {parseFloat(occupancyRate) < 50 && (
            <div className="flex items-start space-x-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <TrendingUp className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800 dark:text-yellow-300">
                  Low Registration Rate
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                  Consider promoting your event more aggressively or adjusting the pricing strategy.
                </p>
              </div>
            </div>
          )}
          
          {parseFloat(occupancyRate) > 80 && (
            <div className="flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <Users className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-800 dark:text-green-300">
                  High Demand
                </h4>
                <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                  Your event is popular! Consider increasing capacity or creating a waitlist.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <Share2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-300">
                Social Media Promotion
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                Share your event on social media to increase visibility and registrations.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EventAnalytics; 