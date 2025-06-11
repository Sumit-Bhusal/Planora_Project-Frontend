import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useEvents } from '../contexts/EventContext';
import { useTickets } from '../contexts/TicketContext';
import { Calendar, Users, BarChart3, TrendingUp, Plus, Eye, Edit, Sparkles, Zap, Target, Award, Settings, Bell, Download, Share2, Star, Clock, MapPin, DollarSign, Filter, Search, Bookmark, Heart, MessageCircle, Share, ExternalLink, ArrowRight, ChevronRight, UserCog, Building2, Trophy, Activity } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import EventCard from '../components/Events/EventCard';
import AttendeeManager from '../components/Events/AttendeeManager';
import ReportExporter from '../components/Events/ReportExporter';
import ShareEvent from '../components/Events/ShareEvent';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { events, userEvents, getRecommendedEvents, registerForEvent } = useEvents();
  const { userTickets, getActiveTickets } = useTickets();
  const navigate = useNavigate();

  // Modal states
  const [showAttendeeManager, setShowAttendeeManager] = useState(false);
  const [showReportExporter, setShowReportExporter] = useState(false);
  const [showShareEvent, setShowShareEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  if (!user) return null;

  const isOrganizer = user.role === 'organizer';
  const organizerEvents = isOrganizer ? events.filter(event => event.organizer.id === user.id) : [];
  const recommendedEvents = !isOrganizer ? getRecommendedEvents(user.interests || []) : [];
  const activeTickets = getActiveTickets();

  const stats = isOrganizer
    ? [
        {
          icon: Calendar,
          label: 'Total Events',
          value: organizerEvents.length.toString(),
          color: 'text-primary-600 dark:text-primary-400',
          bgColor: 'bg-primary-50 dark:bg-primary-900/30',
          change: '+12%',
          description: 'Events created'
        },
        {
          icon: Users,
          label: 'Total Attendees',
          value: organizerEvents.reduce((sum, event) => sum + event.registeredCount, 0).toString(),
          color: 'text-purple-600 dark:text-purple-400',
          bgColor: 'bg-purple-50 dark:bg-purple-900/30',
          change: '+8%',
          description: 'People registered'
        },
        {
          icon: BarChart3,
          label: 'Revenue',
          value: `NPR ${organizerEvents.reduce((sum, event) => sum + (event.registeredCount * event.price), 0).toLocaleString()}`,
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-50 dark:bg-green-900/30',
          change: '+23%',
          description: 'Total earnings'
        },
        {
          icon: TrendingUp,
          label: 'Avg. Attendance',
          value: organizerEvents.length > 0 
            ? `${Math.round((organizerEvents.reduce((sum, event) => sum + (event.registeredCount / event.capacity), 0) / organizerEvents.length) * 100)}%`
            : '0%',
          color: 'text-orange-600 dark:text-orange-400',
          bgColor: 'bg-orange-50 dark:bg-orange-900/30',
          change: '+5%',
          description: 'Capacity utilization'
        }
      ]
    : [
        {
          icon: Calendar,
          label: 'Events Attended',
          value: userTickets.length.toString(),
          color: 'text-secondary-600 dark:text-secondary-400',
          bgColor: 'bg-secondary-50 dark:bg-secondary-900/30',
          change: '+15%',
          description: 'Total events'
        },
        {
          icon: Star,
          label: 'Favorite Categories',
          value: (user.interests || []).length.toString(),
          color: 'text-yellow-600 dark:text-yellow-400',
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/30',
          change: '+2',
          description: 'Interests set'
        },
        {
          icon: Clock,
          label: 'Upcoming Events',
          value: activeTickets.length.toString(),
          color: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-50 dark:bg-blue-900/30',
          change: '+3',
          description: 'Active tickets'
        },
        {
          icon: Heart,
          label: 'Events Saved',
          value: '12',
          color: 'text-pink-600 dark:text-pink-400',
          bgColor: 'bg-pink-50 dark:bg-pink-900/30',
          change: '+5',
          description: 'Bookmarked'
        }
      ];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const handleManageAttendees = () => {
    setShowAttendeeManager(true);
  };

  const handleExportReports = () => {
    setShowReportExporter(true);
  };

  const handleShareEvents = () => {
    // For general sharing, use the first event or create a generic event object
    const eventToShare = organizerEvents[0] || {
      id: 'general',
      title: 'My Events',
      description: 'Check out all my events on Planora',
      date: new Date(),
      venue: 'Various Locations',
      location: 'Nepal',
      image: '/images/event-placeholder.jpg',
      price: 0
    };
    setSelectedEvent(eventToShare);
    setShowShareEvent(true);
  };

  const handleEventEdit = (event: any) => {
    // Navigate to edit event page or open edit modal
    navigate(`/edit-event/${event.id}`);
  };

  const handleEventAnalytics = (event: any) => {
    navigate('/analytics');
  };

  const handleEventShare = (event: any) => {
    setSelectedEvent(event);
    setShowShareEvent(true);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isOrganizer 
        ? 'bg-gradient-to-br from-primary-50 via-purple-50 to-blue-50 dark:from-primary-900/20 dark:via-purple-900/20 dark:to-blue-900/20'
        : 'bg-gray-50 dark:bg-dark-bg-primary'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="relative mr-4">
                {isOrganizer ? (
                  <div className="relative">
                    <Zap className="h-8 w-8 text-primary-600 dark:text-primary-400 animate-pulse" />
                    <div className="absolute inset-0 bg-primary-600 dark:bg-primary-400 rounded-full opacity-20 animate-ping"></div>
                  </div>
                ) : (
                  <div className="relative">
                    <Sparkles className="h-8 w-8 text-secondary-600 dark:text-secondary-400 animate-pulse" />
                    <div className="absolute inset-0 bg-secondary-600 dark:text-secondary-400 rounded-full opacity-20 animate-ping"></div>
                  </div>
                )}
              </div>
              <div>
                <h1 className={`text-3xl font-bold ${
                  isOrganizer 
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-900 dark:text-dark-text-primary'
                }`}>
                  Welcome back, {user.name}
                </h1>
                <p className={`mt-2 ${
                  isOrganizer 
                    ? 'text-gray-700 dark:text-gray-300'
                    : 'text-gray-600 dark:text-dark-text-secondary'
                }`}>
                  {isOrganizer 
                    ? 'Manage your events and track their performance with AI-powered insights'
                    : 'Discover events tailored to your interests with smart recommendations'
                  }
                </p>
              </div>
            </div>
            
            {/* Header Actions */}
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                icon={Bell} 
                size="sm"
                className={isOrganizer ? 'border-primary-200 dark:border-primary-700 text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30' : ''}
              >
                Notifications
              </Button>
              <Button 
                variant="outline" 
                icon={Settings} 
                size="sm"
                className={isOrganizer ? 'border-primary-200 dark:border-primary-700 text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30' : ''}
              >
                Settings
              </Button>
            </div>
          </div>
          
          {/* Role Badge */}
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${
            isOrganizer 
              ? 'bg-gradient-to-r from-primary-100 to-purple-100 dark:from-primary-900/30 dark:to-purple-900/30 text-primary-800 dark:text-primary-300 border-primary-200 dark:border-primary-700'
              : 'bg-gradient-to-r from-secondary-100 to-blue-100 dark:from-secondary-900/30 dark:to-blue-900/30 text-secondary-800 dark:text-secondary-300 border-secondary-200 dark:border-secondary-700'
          }`}>
            {isOrganizer ? (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Event Organizer Dashboard
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Event Explorer Dashboard
              </>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className={`p-6 hover:scale-105 transition-all duration-300 border-0 shadow-lg ${
              isOrganizer ? 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm' : ''
            }`} hover>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`p-3 rounded-xl ${stat.bgColor} ${stat.color} shadow-sm`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className={`text-sm ${
                      isOrganizer ? 'text-gray-700 dark:text-gray-300' : 'text-gray-600 dark:text-dark-text-secondary'
                    }`}>{stat.label}</p>
                    <p className={`text-2xl font-bold ${
                      isOrganizer ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-dark-text-primary'
                    }`}>{stat.value}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    {stat.change}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {isOrganizer ? (
              /* Organizer View */
              <div className="space-y-8">
                {/* Action Buttons Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button 
                    icon={Plus} 
                    className={`h-16 flex-col space-y-1 ${
                      isOrganizer ? 'bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700' : ''
                    }`}
                    onClick={() => navigate('/create-event')}
                  >
                    <span className="text-xs">Create</span>
                    <span className="text-sm font-medium">New Event</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    icon={BarChart3} 
                    className={`h-16 flex-col space-y-1 ${
                      isOrganizer ? 'border-primary-200 dark:border-primary-700 text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30' : ''
                    }`}
                    onClick={() => navigate('/analytics')}
                  >
                    <span className="text-xs">View</span>
                    <span className="text-sm font-medium">Analytics</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    icon={Users} 
                    className={`h-16 flex-col space-y-1 ${
                      isOrganizer ? 'border-primary-200 dark:border-primary-700 text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30' : ''
                    }`}
                    onClick={handleManageAttendees}
                  >
                    <span className="text-xs">Manage</span>
                    <span className="text-sm font-medium">Attendees</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    icon={Share2} 
                    className={`h-16 flex-col space-y-1 ${
                      isOrganizer ? 'border-primary-200 dark:border-primary-700 text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30' : ''
                    }`}
                    onClick={handleShareEvents}
                  >
                    <span className="text-xs">Share</span>
                    <span className="text-sm font-medium">Events</span>
                  </Button>
                </div>

                {/* Recent Events */}
                <Card className={`p-6 ${
                  isOrganizer ? 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-primary-200 dark:border-primary-700' : ''
                }`}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className={`text-lg font-semibold flex items-center ${
                      isOrganizer ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-dark-text-primary'
                    }`}>
                      <Building2 className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                      Your Events
                    </h3>
                    <Link
                      to="/events"
                      className={`text-sm font-medium flex items-center space-x-1 ${
                        isOrganizer ? 'text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300' : 'text-secondary-600 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-300'
                      }`}
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
                    <Card className={`p-12 text-center ${
                      isOrganizer 
                        ? 'bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 border-primary-200 dark:border-primary-800'
                        : 'bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-primary-200 dark:border-primary-800'
                    }`}>
                      <div className="relative mb-6">
                        <Calendar className="h-16 w-16 text-primary-400 dark:text-primary-500 mx-auto animate-float" />
                        <div className="absolute inset-0 bg-primary-400 dark:bg-primary-500 rounded-full opacity-20 animate-ping"></div>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text-primary mb-2">
                        Ready to create your first event?
                      </h3>
                      <p className="text-gray-500 dark:text-dark-text-tertiary mb-6">
                        Start building your audience with our AI-powered event creation tools
                      </p>
                      <Button 
                        icon={Plus} 
                        className={`transform hover:scale-105 transition-all ${
                          isOrganizer ? 'bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700' : ''
                        }`}
                        onClick={() => navigate('/create-event')}
                      >
                        Create Your First Event
                      </Button>
                    </Card>
                  )}
                </Card>
              </div>
            ) : (
              /* User View */
              <div className="space-y-8">
                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button 
                    icon={Search} 
                    className="h-16 flex-col space-y-1 bg-gradient-to-r from-secondary-600 to-blue-600 hover:from-secondary-700 hover:to-blue-700"
                    onClick={() => navigate('/events')}
                  >
                    <span className="text-xs">Discover</span>
                    <span className="text-sm font-medium">Events</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    icon={Bookmark} 
                    className="h-16 flex-col space-y-1 border-secondary-200 dark:border-secondary-700 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-900/30"
                  >
                    <span className="text-xs">Saved</span>
                    <span className="text-sm font-medium">Events</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    icon={Heart} 
                    className="h-16 flex-col space-y-1 border-secondary-200 dark:border-secondary-700 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-900/30"
                  >
                    <span className="text-xs">Favorites</span>
                    <span className="text-sm font-medium">Categories</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    icon={Share} 
                    className="h-16 flex-col space-y-1 border-secondary-200 dark:border-secondary-700 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-900/30"
                  >
                    <span className="text-xs">Share</span>
                    <span className="text-sm font-medium">Events</span>
                  </Button>
                </div>

                {/* Recommended Events */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text-primary flex items-center">
                      <Sparkles className="h-5 w-5 mr-2 text-secondary-600 dark:text-secondary-400" />
                      Recommended for You
                    </h3>
                    <Link
                      to="/events"
                      className="text-sm font-medium text-secondary-600 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-300 flex items-center space-x-1"
                    >
                      <span>View All</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>

                  {recommendedEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {recommendedEvents.slice(0, 4).map((event) => (
                        <EventCard
                          key={event.id}
                          event={event}
                          variant="user"
                          onRegister={() => registerForEvent(event.id)}
                        />
                      ))}
                    </div>
                  ) : (
                    <Card className="p-12 text-center bg-gradient-to-br from-secondary-50 to-blue-50 dark:from-secondary-900/20 dark:to-blue-900/20 border-secondary-200 dark:border-secondary-800">
                      <div className="relative mb-6">
                        <Sparkles className="h-16 w-16 text-secondary-400 dark:text-secondary-500 mx-auto animate-float" />
                        <div className="absolute inset-0 bg-secondary-400 dark:bg-secondary-500 rounded-full opacity-20 animate-ping"></div>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text-primary mb-2">
                        Discover Amazing Events
                      </h3>
                      <p className="text-gray-500 dark:text-dark-text-tertiary mb-6">
                        Set your interests to get personalized event recommendations
                      </p>
                      <Button 
                        icon={Search} 
                        className="transform hover:scale-105 transition-all bg-gradient-to-r from-secondary-600 to-blue-600 hover:from-secondary-700 hover:to-blue-700"
                        onClick={() => navigate('/events')}
                      >
                        Browse Events
                      </Button>
                    </Card>
                  )}
                </Card>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {isOrganizer ? (
              <>
                {/* Quick Actions */}
                <Card className={`p-6 ${
                  isOrganizer ? 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-primary-200 dark:border-primary-700' : ''
                }`}>
                  <h3 className={`text-lg font-semibold mb-4 flex items-center ${
                    isOrganizer ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-dark-text-primary'
                  }`}>
                    <Zap className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className={`w-full justify-start transform hover:scale-105 transition-all ${
                        isOrganizer ? 'border-primary-200 dark:border-primary-700 text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30' : ''
                      }`} 
                      icon={Plus}
                      onClick={() => navigate('/create-event')}
                    >
                      Create New Event
                    </Button>
                    <Button 
                      variant="outline" 
                      className={`w-full justify-start transform hover:scale-105 transition-all ${
                        isOrganizer ? 'border-primary-200 dark:border-primary-700 text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30' : ''
                      }`} 
                      icon={BarChart3}
                      onClick={() => navigate('/analytics')}
                    >
                      View Analytics
                    </Button>
                    <Button 
                      variant="outline" 
                      className={`w-full justify-start transform hover:scale-105 transition-all ${
                        isOrganizer ? 'border-primary-200 dark:border-primary-700 text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30' : ''
                      }`} 
                      icon={Users}
                      onClick={handleManageAttendees}
                    >
                      Manage Attendees
                    </Button>
                    <Button 
                      variant="outline" 
                      className={`w-full justify-start transform hover:scale-105 transition-all ${
                        isOrganizer ? 'border-primary-200 dark:border-primary-700 text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30' : ''
                      }`} 
                      icon={Download}
                      onClick={handleExportReports}
                    >
                      Export Reports
                    </Button>
                    <Button 
                      variant="outline" 
                      className={`w-full justify-start transform hover:scale-105 transition-all ${
                        isOrganizer ? 'border-primary-200 dark:border-primary-700 text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30' : ''
                      }`} 
                      icon={Share2}
                      onClick={handleShareEvents}
                    >
                      Share Events
                    </Button>
                  </div>
                </Card>

                {/* Recent Activity */}
                <Card className={`p-6 ${
                  isOrganizer ? 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-primary-200 dark:border-primary-700' : ''
                }`}>
                  <h3 className={`text-lg font-semibold mb-4 flex items-center ${
                    isOrganizer ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-dark-text-primary'
                  }`}>
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
                  </div>
                </Card>
              </>
            ) : (
              <>
                {/* Quick Actions */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text-primary mb-4 flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-secondary-600 dark:text-secondary-400" />
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start transform hover:scale-105 transition-all border-secondary-200 dark:border-secondary-700 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-900/30" 
                      icon={Search}
                      onClick={() => navigate('/events')}
                    >
                      Discover Events
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start transform hover:scale-105 transition-all border-secondary-200 dark:border-secondary-700 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-900/30" 
                      icon={Bookmark}
                    >
                      Saved Events
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start transform hover:scale-105 transition-all border-secondary-200 dark:border-secondary-700 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-900/30" 
                      icon={Heart}
                    >
                      Favorite Categories
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start transform hover:scale-105 transition-all border-secondary-200 dark:border-secondary-700 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-900/30" 
                      icon={Share}
                    >
                      Share Events
                    </Button>
                  </div>
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
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2 border-secondary-200 dark:border-secondary-700 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-900/30"
                          onClick={() => navigate('/events')}
                        >
                          Browse Events
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAttendeeManager && (
        <AttendeeManager
          eventId={organizerEvents[0]?.id || ''}
          eventTitle={organizerEvents[0]?.title || 'All Events'}
          onClose={() => setShowAttendeeManager(false)}
        />
      )}

      {showReportExporter && (
        <ReportExporter
          eventId={organizerEvents[0]?.id}
          eventTitle={organizerEvents[0]?.title || 'All Events'}
          onClose={() => setShowReportExporter(false)}
        />
      )}

      {showShareEvent && selectedEvent && (
        <ShareEvent
          event={selectedEvent}
          onClose={() => {
            setShowShareEvent(false);
            setSelectedEvent(null);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;