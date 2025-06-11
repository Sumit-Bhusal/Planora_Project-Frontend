import React, { useState } from 'react';
import { Users, Clock, Mail, Phone, UserPlus, UserCheck, X, Send } from 'lucide-react';
import Card from '../UI/Card';
import Button from '../UI/Button';

interface WaitlistEntry {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinedAt: Date;
  status: 'waiting' | 'notified' | 'registered';
  priority: number;
}

interface WaitlistManagerProps {
  eventId: string;
  eventTitle: string;
  maxCapacity: number;
  currentRegistrations: number;
  onNotifyEntry: (entryId: string) => void;
  onRemoveEntry: (entryId: string) => void;
}

const WaitlistManager: React.FC<WaitlistManagerProps> = ({
  eventId,
  eventTitle,
  maxCapacity,
  currentRegistrations,
  onNotifyEntry,
  onRemoveEntry
}) => {
  const [selectedEntry, setSelectedEntry] = useState<WaitlistEntry | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Mock waitlist data - in real app, this would come from props or API
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1-555-0123',
      joinedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      status: 'waiting',
      priority: 1
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1-555-0124',
      joinedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      status: 'waiting',
      priority: 2
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      phone: '+1-555-0125',
      joinedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      status: 'notified',
      priority: 3
    }
  ]);

  const availableSpots = maxCapacity - currentRegistrations;
  const waitingCount = waitlist.filter(entry => entry.status === 'waiting').length;
  const notifiedCount = waitlist.filter(entry => entry.status === 'notified').length;

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEntry.name && newEntry.email) {
      const entry: WaitlistEntry = {
        id: Math.random().toString(36).substr(2, 9),
        name: newEntry.name,
        email: newEntry.email,
        phone: newEntry.phone,
        joinedAt: new Date(),
        status: 'waiting',
        priority: waitlist.length + 1
      };
      
      setWaitlist([...waitlist, entry]);
      setNewEntry({ name: '', email: '', phone: '' });
      setShowAddForm(false);
    }
  };

  const handleNotifyEntry = (entry: WaitlistEntry) => {
    const updatedWaitlist = waitlist.map(item =>
      item.id === entry.id ? { ...item, status: 'notified' as const } : item
    );
    setWaitlist(updatedWaitlist);
    onNotifyEntry(entry.id);
  };

  const handleRemoveEntry = (entryId: string) => {
    setWaitlist(waitlist.filter(entry => entry.id !== entryId));
    onRemoveEntry(entryId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
      case 'notified':
        return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20';
      case 'registered':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'waiting':
        return <Clock className="h-4 w-4" />;
      case 'notified':
        return <Mail className="h-4 w-4" />;
      case 'registered':
        return <UserCheck className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Waitlist Management
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage overflow registrations for "{eventTitle}"
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2"
        >
          <UserPlus className="h-4 w-4" />
          <span>Add to Waitlist</span>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Available Spots
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {availableSpots}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
              <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Waiting
              </p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {waitingCount}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
              <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Notified
              </p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {notifiedCount}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Total Waitlist
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {waitlist.length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/20">
              <Users className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Add Entry Form */}
      {showAddForm && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Add to Waitlist
            </h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <form onSubmit={handleAddEntry} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newEntry.name}
                  onChange={(e) => setNewEntry({ ...newEntry, name: e.target.value })}
                  className="input-field"
                  placeholder="Enter full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={newEntry.email}
                  onChange={(e) => setNewEntry({ ...newEntry, email: e.target.value })}
                  className="input-field"
                  placeholder="Enter email address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={newEntry.phone}
                  onChange={(e) => setNewEntry({ ...newEntry, phone: e.target.value })}
                  className="input-field"
                  placeholder="Enter phone number"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Add to Waitlist
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Waitlist Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Waitlist Entries
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Priority
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Contact
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Joined
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {waitlist.map((entry) => (
                <tr key={entry.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 text-sm font-medium">
                      {entry.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {entry.name}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {entry.email}
                      </p>
                      {entry.phone && (
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                          {entry.phone}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {entry.joinedAt.toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {entry.joinedAt.toLocaleTimeString()}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(entry.status)}`}>
                      {getStatusIcon(entry.status)}
                      <span className="capitalize">{entry.status}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {entry.status === 'waiting' && availableSpots > 0 && (
                        <button
                          onClick={() => handleNotifyEntry(entry)}
                          className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                          title="Notify about available spot"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleRemoveEntry(entry.id)}
                        className="p-1 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                        title="Remove from waitlist"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {waitlist.length === 0 && (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No entries in waitlist yet
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default WaitlistManager; 