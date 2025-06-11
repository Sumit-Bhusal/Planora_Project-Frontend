import React, { useState } from 'react';
import { Users, Mail, Phone, Calendar, MapPin, Search, Filter, Download, Send, UserCheck, UserX, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Input from '../UI/Input';

interface Attendee {
  id: string;
  name: string;
  email: string;
  phone: string;
  registrationDate: Date;
  status: 'confirmed' | 'pending' | 'cancelled';
  ticketType: string;
  paymentStatus: 'paid' | 'pending' | 'refunded';
  checkInStatus: 'checked-in' | 'not-checked-in';
}

interface AttendeeManagerProps {
  eventId: string;
  eventTitle: string;
  onClose: () => void;
}

const AttendeeManager: React.FC<AttendeeManagerProps> = ({ eventId, eventTitle, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([]);

  // Mock attendee data
  const [attendees] = useState<Attendee[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+977-9841234567',
      registrationDate: new Date('2024-01-15'),
      status: 'confirmed',
      ticketType: 'VIP',
      paymentStatus: 'paid',
      checkInStatus: 'checked-in'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+977-9841234568',
      registrationDate: new Date('2024-01-16'),
      status: 'confirmed',
      ticketType: 'Regular',
      paymentStatus: 'paid',
      checkInStatus: 'not-checked-in'
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      phone: '+977-9841234569',
      registrationDate: new Date('2024-01-17'),
      status: 'pending',
      ticketType: 'Regular',
      paymentStatus: 'pending',
      checkInStatus: 'not-checked-in'
    },
    {
      id: '4',
      name: 'Alice Brown',
      email: 'alice@example.com',
      phone: '+977-9841234570',
      registrationDate: new Date('2024-01-18'),
      status: 'confirmed',
      ticketType: 'VIP',
      paymentStatus: 'paid',
      checkInStatus: 'checked-in'
    }
  ]);

  const filteredAttendees = attendees.filter(attendee => {
    const matchesSearch = attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         attendee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || attendee.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSelectAll = () => {
    if (selectedAttendees.length === filteredAttendees.length) {
      setSelectedAttendees([]);
    } else {
      setSelectedAttendees(filteredAttendees.map(a => a.id));
    }
  };

  const handleSelectAttendee = (attendeeId: string) => {
    setSelectedAttendees(prev => 
      prev.includes(attendeeId) 
        ? prev.filter(id => id !== attendeeId)
        : [...prev, attendeeId]
    );
  };

  const handleSendNotification = () => {
    // Mock notification sending
    alert(`Notification sent to ${selectedAttendees.length} attendees`);
    setSelectedAttendees([]);
  };

  const handleExportAttendees = () => {
    // Mock export functionality
    const csvContent = [
      'Name,Email,Phone,Registration Date,Status,Ticket Type,Payment Status,Check-in Status',
      ...filteredAttendees.map(a => 
        `${a.name},${a.email},${a.phone},${a.registrationDate.toLocaleDateString()},${a.status},${a.ticketType},${a.paymentStatus},${a.checkInStatus}`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${eventTitle}_attendees.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'cancelled': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'refunded': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default: return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden bg-white dark:bg-gray-800">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Manage Attendees</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{eventTitle}</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                icon={Download}
                onClick={handleExportAttendees}
                className="border-primary-200 dark:border-primary-700 text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30"
              >
                Export
              </Button>
              <Button 
                variant="outline" 
                onClick={onClose}
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Close
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Filters and Search */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Input
                placeholder="Search attendees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={Search}
                className="w-64"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {filteredAttendees.length} attendees
              </span>
              {selectedAttendees.length > 0 && (
                <Button 
                  icon={Send}
                  onClick={handleSendNotification}
                  className="bg-primary-600 hover:bg-primary-700"
                >
                  Send Notification ({selectedAttendees.length})
                </Button>
              )}
            </div>
          </div>

          {/* Attendees Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedAttendees.length === filteredAttendees.length && filteredAttendees.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
                    />
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Contact</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Registration Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Ticket Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Payment</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Check-in</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendees.map((attendee) => (
                  <tr key={attendee.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedAttendees.includes(attendee.id)}
                        onChange={() => handleSelectAttendee(attendee.id)}
                        className="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{attendee.name}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Mail className="h-3 w-3 mr-1" />
                          {attendee.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Phone className="h-3 w-3 mr-1" />
                          {attendee.phone}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                      {attendee.registrationDate.toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(attendee.status)}`}>
                        {attendee.status.charAt(0).toUpperCase() + attendee.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                      {attendee.ticketType}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(attendee.paymentStatus)}`}>
                        {attendee.paymentStatus.charAt(0).toUpperCase() + attendee.paymentStatus.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {attendee.checkInStatus === 'checked-in' ? (
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <Clock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          icon={Mail}
                          className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          Contact
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAttendees.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No attendees found</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AttendeeManager; 