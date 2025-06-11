import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Clock, Users } from 'lucide-react';
import Card from '../UI/Card';

interface Event {
  id: string;
  title: string;
  date: Date;
  time: string;
  location: string;
  capacity: number;
  registeredCount: number;
  category: string;
}

interface EventCalendarProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

const EventCalendar: React.FC<EventCalendarProps> = ({ events, onEventClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === date.getDate() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear();
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const renderCalendarDays = () => {
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-32 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = getEventsForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();

      days.push(
        <div
          key={day}
          className={`h-32 border border-gray-200 dark:border-gray-700 p-2 ${
            isToday 
              ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-300 dark:border-primary-600' 
              : 'bg-white dark:bg-gray-800'
          } hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className={`text-sm font-medium ${
              isToday 
                ? 'text-primary-600 dark:text-primary-400' 
                : 'text-gray-900 dark:text-gray-100'
            }`}>
              {day}
            </span>
            {dayEvents.length > 0 && (
              <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 px-1.5 py-0.5 rounded-full">
                {dayEvents.length}
              </span>
            )}
          </div>
          
          <div className="space-y-1 max-h-20 overflow-y-auto">
            {dayEvents.slice(0, 2).map((event) => (
              <div
                key={event.id}
                onClick={() => onEventClick(event)}
                className="text-xs p-1 bg-secondary-50 dark:bg-secondary-900/20 rounded cursor-pointer hover:bg-secondary-100 dark:hover:bg-secondary-900/30 transition-colors duration-200"
                title={event.title}
              >
                <div className="font-medium text-secondary-800 dark:text-secondary-300 truncate">
                  {event.title}
                </div>
                <div className="text-secondary-600 dark:text-secondary-400 truncate">
                  {event.time}
                </div>
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                +{dayEvents.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Technology': 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300',
      'Business': 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300',
      'Arts': 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300',
      'Music': 'bg-pink-100 dark:bg-pink-900/20 text-pink-800 dark:text-pink-300',
      'Sports': 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300',
      'Education': 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-300',
      'Health': 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300',
      'Food': 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300',
      'Travel': 'bg-teal-100 dark:bg-teal-900/20 text-teal-800 dark:text-teal-300',
      'Science': 'bg-cyan-100 dark:bg-cyan-900/20 text-cyan-800 dark:text-cyan-300',
      'Entertainment': 'bg-rose-100 dark:bg-rose-900/20 text-rose-800 dark:text-rose-300',
      'Other': 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-300'
    };
    return colors[category] || colors['Other'];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Calendar className="h-8 w-8 text-primary-600 dark:text-primary-400" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Event Calendar
          </h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            
            <span className="text-lg font-semibold text-gray-900 dark:text-white min-w-[150px] text-center">
              {monthName}
            </span>
            
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 text-sm bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-lg transition-colors duration-200"
          >
            Today
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card className="p-6">
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="h-10 flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {renderCalendarDays()}
        </div>
      </Card>

      {/* Legend */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Event Categories
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {Array.from(new Set(events.map(event => event.category))).map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getCategoryColor(category).split(' ')[0]}`}></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">{category}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Upcoming Events Summary */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Upcoming Events This Month
        </h3>
        <div className="space-y-3">
          {events
            .filter(event => {
              const eventDate = new Date(event.date);
              return eventDate.getMonth() === currentDate.getMonth() &&
                     eventDate.getFullYear() === currentDate.getFullYear() &&
                     eventDate >= new Date();
            })
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, 5)
            .map((event) => (
              <div
                key={event.id}
                onClick={() => onEventClick(event)}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${getCategoryColor(event.category).split(' ')[0]}`}></div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {event.title}
                    </h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Users className="h-4 w-4" />
                  <span>{event.registeredCount}/{event.capacity}</span>
                </div>
              </div>
            ))}
        </div>
        
        {events.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate.getMonth() === currentDate.getMonth() &&
                 eventDate.getFullYear() === currentDate.getFullYear() &&
                 eventDate >= new Date();
        }).length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No upcoming events this month
          </div>
        )}
      </Card>
    </div>
  );
};

export default EventCalendar; 