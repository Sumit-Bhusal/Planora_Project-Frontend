import React, { useState } from 'react';
import { Calendar, MapPin, User, DollarSign, Download, X, AlertTriangle, Search, Filter, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTickets, UserTicket } from '../contexts/TicketContext';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import TicketDownload from '../components/Tickets/TicketDownload';
import TicketCancellationModal from '../components/Tickets/TicketCancellationModal';

const UserTickets: React.FC = () => {
  const { user } = useAuth();
  const { userTickets, cancelTicket } = useTickets();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'cancelled' | 'used'>('all');
  const [showTicketDownload, setShowTicketDownload] = useState(false);
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<UserTicket | null>(null);

  const filteredTickets = userTickets.filter(ticket => {
    const matchesSearch = ticket.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.bookingDetails.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800';
      case 'cancelled':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800';
      case 'used':
        return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30 border-gray-200 dark:border-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      case 'used':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleDownloadTicket = (ticket: UserTicket) => {
    setSelectedTicket(ticket);
    setShowTicketDownload(true);
  };

  const handleCancelTicket = (ticket: UserTicket) => {
    setSelectedTicket(ticket);
    setShowCancellationModal(true);
  };

  const handleCancellationComplete = () => {
    if (selectedTicket) {
      cancelTicket(selectedTicket.id);
    }
    setShowCancellationModal(false);
    setSelectedTicket(null);
  };

  const stats = [
    {
      label: 'Active Tickets',
      value: userTickets.filter(t => t.status === 'active').length,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/30'
    },
    {
      label: 'Total Spent',
      value: `NPR ${userTickets.reduce((sum, ticket) => sum + ticket.originalPrice, 0).toLocaleString()}`,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/30'
    },
    {
      label: 'Cancelled Tickets',
      value: userTickets.filter(t => t.status === 'cancelled').length,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/30'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg-primary transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text-primary mb-2">My Tickets</h1>
          <p className="text-gray-600 dark:text-dark-text-secondary">Manage and download your event tickets</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${stat.bgColor} ${stat.color} mb-4`}>
                <Calendar className="h-6 w-6" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary">{stat.value}</p>
              <p className="text-sm text-gray-600 dark:text-dark-text-secondary">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Search and Filters */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search tickets by event name, venue, or ticket holder..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={Search}
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'cancelled' | 'used')}
                className="px-4 py-2 border border-gray-300 dark:border-dark-border-primary rounded-lg bg-white dark:bg-dark-bg-tertiary text-gray-900 dark:text-dark-text-primary focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400 transition-colors"
              >
                <option value="all">All Tickets</option>
                <option value="active">Active</option>
                <option value="cancelled">Cancelled</option>
                <option value="used">Used</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Tickets List */}
        {filteredTickets.length > 0 ? (
          <div className="space-y-6">
            {filteredTickets.map((ticket) => (
              <Card key={ticket.id} className="p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text-primary mb-1">
                          {ticket.eventTitle}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-dark-text-secondary">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(ticket.eventDate)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{ticket.venue}, {ticket.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>{ticket.bookingDetails.fullName}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                          {getStatusIcon(ticket.status)}
                          <span className="ml-1 capitalize">{ticket.status}</span>
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-gray-500 dark:text-dark-text-tertiary" />
                        <span className="text-gray-600 dark:text-dark-text-secondary">Price:</span>
                        <span className="font-medium text-gray-900 dark:text-dark-text-primary">NPR {ticket.originalPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500 dark:text-dark-text-tertiary" />
                        <span className="text-gray-600 dark:text-dark-text-secondary">Purchased:</span>
                        <span className="font-medium text-gray-900 dark:text-dark-text-primary">{formatDate(ticket.purchaseDate)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500 dark:text-dark-text-tertiary" />
                        <span className="text-gray-600 dark:text-dark-text-secondary">Organizer:</span>
                        <span className="font-medium text-gray-900 dark:text-dark-text-primary">{ticket.organizer}</span>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="mt-4 p-3 bg-gray-50 dark:bg-dark-bg-tertiary rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-dark-text-tertiary uppercase tracking-wider mb-2">
                        Ticket Details
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-600 dark:text-dark-text-secondary">Ticket ID:</span>
                          <span className="font-mono font-medium text-gray-900 dark:text-dark-text-primary ml-2">{ticket.ticketId}</span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-dark-text-secondary">Age:</span>
                          <span className="font-medium text-gray-900 dark:text-dark-text-primary ml-2">{ticket.bookingDetails.age} years</span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-dark-text-secondary">Email:</span>
                          <span className="font-medium text-gray-900 dark:text-dark-text-primary ml-2">{ticket.bookingDetails.email}</span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-dark-text-secondary">Phone:</span>
                          <span className="font-medium text-gray-900 dark:text-dark-text-primary ml-2">{ticket.bookingDetails.phone}</span>
                        </div>
                        {ticket.bookingDetails.emergencyContact && (
                          <div className="md:col-span-2">
                            <span className="text-gray-600 dark:text-dark-text-secondary">Emergency Contact:</span>
                            <span className="font-medium text-gray-900 dark:text-dark-text-primary ml-2">{ticket.bookingDetails.emergencyContact}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 mt-4 lg:mt-0 lg:ml-6">
                    {ticket.status === 'active' && (
                      <>
                        <Button
                          onClick={() => handleDownloadTicket(ticket)}
                          icon={Download}
                          variant="outline"
                          className="w-full lg:w-auto"
                        >
                          Download Ticket
                        </Button>
                        <Button
                          onClick={() => handleCancelTicket(ticket)}
                          icon={X}
                          variant="outline"
                          className="w-full lg:w-auto text-red-600 dark:text-red-400 border-red-300 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/30"
                        >
                          Cancel Ticket
                        </Button>
                      </>
                    )}
                    {ticket.status === 'cancelled' && (
                      <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mx-auto mb-1" />
                        <p className="text-xs text-red-600 dark:text-red-400">Cancelled</p>
                      </div>
                    )}
                    {ticket.status === 'used' && (
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                        <p className="text-xs text-blue-600 dark:text-blue-400">Used</p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Calendar className="h-12 w-12 text-gray-400 dark:text-dark-text-tertiary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text-primary mb-2">
              {userTickets.length === 0 ? 'No tickets yet' : 'No tickets found'}
            </h3>
            <p className="text-gray-500 dark:text-dark-text-tertiary mb-6">
              {userTickets.length === 0 
                ? 'You haven\'t booked any tickets yet. Start exploring events!'
                : searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your search criteria or filters'
                  : 'No tickets match your current filters'
              }
            </p>
            {userTickets.length === 0 && (
              <Button>
                Browse Events
              </Button>
            )}
          </Card>
        )}
      </div>

      {/* Ticket Download Modal */}
      {showTicketDownload && selectedTicket && (
        <TicketDownload
          event={{
            title: selectedTicket.eventTitle,
            date: selectedTicket.eventDate,
            venue: selectedTicket.venue,
            location: selectedTicket.location,
            price: selectedTicket.originalPrice,
            organizer: selectedTicket.organizer
          }}
          ticketHolder={{
            fullName: selectedTicket.bookingDetails.fullName,
            email: selectedTicket.bookingDetails.email,
            phone: selectedTicket.bookingDetails.phone
          }}
          ticketId={selectedTicket.ticketId}
          paymentMethod="Credit Card"
          onClose={() => {
            setShowTicketDownload(false);
            setSelectedTicket(null);
          }}
        />
      )}

      {/* Ticket Cancellation Modal */}
      {showCancellationModal && selectedTicket && (
        <TicketCancellationModal
          isOpen={showCancellationModal}
          onClose={() => {
            setShowCancellationModal(false);
            setSelectedTicket(null);
          }}
          ticket={{
            id: selectedTicket.id,
            eventTitle: selectedTicket.eventTitle,
            eventDate: selectedTicket.eventDate,
            venue: selectedTicket.venue,
            location: selectedTicket.location,
            ticketHolder: selectedTicket.bookingDetails.fullName,
            originalPrice: selectedTicket.originalPrice,
            purchaseDate: selectedTicket.purchaseDate,
          }}
          onCancellationComplete={handleCancellationComplete}
        />
      )}
    </div>
  );
};

export default UserTickets; 