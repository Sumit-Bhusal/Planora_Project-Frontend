import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useEvents } from '../contexts/EventContext';
import { BarChart3, Users, DollarSign, TrendingUp, Eye, Share2, Calendar, MapPin, Target, Zap, Activity, Download, Filter, ArrowUp, ArrowDown } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import EventAnalytics from '../components/Events/EventAnalytics';

const Analytics: React.FC = () => {
  const { user } = useAuth();
  const { events, getEventAnalytics } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  if (!user || user.role !== 'organizer') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg-primary flex items-center justify-center">
        <Card className="p-8 text-center">
          <Zap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400">Analytics are only available for event organizers.</p>
        </Card>
      </div>
    );
  }

  const organizerEvents = events.filter(event => event.organizer.id === user.id);
  
  // Calculate overall analytics
  const totalEvents = organizerEvents.length;
  const totalRegistrations = organizerEvents.reduce((sum, event) => sum + event.registeredCount, 0);
  const totalRevenue = organizerEvents.reduce((sum, event) => sum + (event.registeredCount * event.price), 0);
  const avgAttendance = totalEvents > 0 ? Math.round((totalRegistrations / totalEvents) * 100) / 100 : 0;
  
  // Mock data for trends
  const trends = {
    registrations: { current: totalRegistrations, previous: Math.round(totalRegistrations * 0.85), change: '+15%' },
    revenue: { current: totalRevenue, previous: Math.round(totalRevenue * 0.92), change: '+8%' },
    events: { current: totalEvents, previous: Math.max(0, totalEvents - 2), change: '+2' },
    attendance: { current: avgAttendance, previous: Math.round(avgAttendance * 0.95), change: '+5%' }
  };

  const stats = [
    {
      label: 'Total Events',
      value: totalEvents.toString(),
      icon: Calendar,
      color: 'text-primary-600 dark:text-primary-400',
      bgColor: 'bg-primary-50 dark:bg-primary-900/30',
      trend: trends.events.change,
      trendDirection: 'up'
    },
    {
      label: 'Total Registrations',
      value: totalRegistrations.toLocaleString(),
      icon: Users,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/30',
      trend: trends.registrations.change,
      trendDirection: 'up'
    },
    {
      label: 'Total Revenue',
      value: `NPR ${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/30',
      trend: trends.revenue.change,
      trendDirection: 'up'
    },
    {
      label: 'Avg. Attendance',
      value: `${avgAttendance}%`,
      icon: TrendingUp,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/30',
      trend: trends.attendance.change,
      trendDirection: 'up'
    }
  ];

  const topEvents = organizerEvents
    .sort((a, b) => b.registeredCount - a.registeredCount)
    .slice(0, 5);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

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
                  Track your event performance and gain insights to improve future events
                </p>
              </div>
            </div>
            
            {/* Header Actions */}
            <div className="flex items-center space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d' | '1y')}
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
            <Card key={index} className="p-6 hover:scale-105 transition-all duration-300 border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm" hover>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`p-3 rounded-xl ${stat.bgColor} ${stat.color} shadow-sm`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    {stat.trendDirection === 'up' ? (
                      <ArrowUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                    )}
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                      {stat.trend}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Overview Chart */}
            <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-primary-200 dark:border-primary-700 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                  Registration Trends
                </h3>
                <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                  <BarChart3 className="h-5 w-5" />
                  <span className="text-sm">Last {timeRange === '7d' ? '7' : timeRange === '30d' ? '30' : timeRange === '90d' ? '90' : '365'} days</span>
                </div>
              </div>
              
              {/* Placeholder for chart */}
              <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Registration trends chart would be implemented here
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    Showing registration patterns over {timeRange === '7d' ? '7' : timeRange === '30d' ? '30' : timeRange === '90d' ? '90' : '365'} days
                  </p>
                </div>
              </div>
            </Card>

            {/* Top Performing Events */}
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
                {topEvents.map((event, index) => (
                  <div key={event.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                       onClick={() => setSelectedEvent(selectedEvent === event.id ? null : event.id)}>
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400 font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{event.title}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <span>{formatDate(event.date)}</span>
                          <span>•</span>
                          <span>{event.registeredCount} registrations</span>
                          <span>•</span>
                          <span>NPR {(event.registeredCount * event.price).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {Math.round((event.registeredCount / event.capacity) * 100)}% full
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {event.capacity - event.registeredCount} spots left
                      </div>
                    </div>
                  </div>
                ))}
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
                    <span className="text-sm font-medium text-green-800 dark:text-green-300">Growth Trend</span>
                  </div>
                  <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                    Your events are showing consistent growth in registrations
                  </p>
                </div>
                
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-300">Audience Engagement</span>
                  </div>
                  <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                    High engagement rates suggest good event quality
                  </p>
                </div>

                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm font-medium text-purple-800 dark:text-purple-300">Revenue Growth</span>
                  </div>
                  <p className="text-xs text-purple-700 dark:text-purple-400 mt-1">
                    Revenue is increasing steadily with event frequency
                  </p>
                </div>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-primary-200 dark:border-primary-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                Recent Activity
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">New registration for Tech Meetup</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Event "Music Festival" published</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">1 hour ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Analytics report generated</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">3 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Payment received for Workshop</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">5 hours ago</p>
                  </div>
                </div>
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
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-300 text-sm">Optimize Pricing</h4>
                  <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                    Consider adjusting prices based on demand patterns
                  </p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-medium text-blue-800 dark:text-blue-300 text-sm">Increase Promotion</h4>
                  <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                    Events with more promotion show higher registration rates
                  </p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-medium text-green-800 dark:text-green-300 text-sm">Expand Categories</h4>
                  <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                    Technology events are performing exceptionally well
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Individual Event Analytics Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Event Analytics</h2>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedEvent(null)}
                    className="border-primary-200 dark:border-primary-700 text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30"
                  >
                    Close
                  </Button>
                </div>
                {(() => {
                  const event = organizerEvents.find(e => e.id === selectedEvent);
                  if (!event) return null;
                  
                  const mockEventData = {
                    id: event.id,
                    title: event.title,
                    views: Math.round(event.registeredCount * 3.5),
                    registrations: event.registeredCount,
                    revenue: event.registeredCount * event.price,
                    capacity: event.capacity,
                    date: event.date,
                    location: event.location
                  };
                  
                  return <EventAnalytics event={mockEventData} />;
                })()}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics; 