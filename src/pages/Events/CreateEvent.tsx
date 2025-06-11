import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, DollarSign, Users, Image, Tag, Save, Sparkles, AlertTriangle } from 'lucide-react';
import { useEvents } from '../../contexts/EventContext';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import Card from '../../components/UI/Card';
import PaymentModal from '../../components/Payment/PaymentModal';

const CreateEvent: React.FC = () => {
  const { createEvent } = useEvents();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    date: '',
    endDate: '',
    location: '',
    venue: '',
    price: '',
    capacity: '',
    image: '',
    tags: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const categories = ['Technology', 'Business', 'Arts', 'Sports', 'Music', 'Education'];
  const eventCreationFee = 10000; // NPR 10,000

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.title || !formData.description || !formData.category || 
        !formData.date || !formData.location || !formData.venue || 
        !formData.price || !formData.capacity) {
      setError('Please fill in all required fields');
      return false;
    }

    if (new Date(formData.date) <= new Date()) {
      setError('Event date must be in the future');
      return false;
    }

    if (formData.endDate && new Date(formData.endDate) <= new Date(formData.date)) {
      setError('End date must be after start date');
      return false;
    }

    if (parseFloat(formData.price) < 0) {
      setError('Price cannot be negative');
      return false;
    }

    if (parseInt(formData.capacity) < 1) {
      setError('Capacity must be at least 1');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('You must be logged in to create an event');
      return;
    }

    if (!validateForm()) {
      return;
    }

    // Show payment modal for event creation fee
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async () => {
    setIsLoading(true);

    try {
      const eventData = {
        title: formData.title,
        description: formData.description,
        organizer: user,
        category: formData.category,
        date: new Date(formData.date),
        endDate: formData.endDate ? new Date(formData.endDate) : undefined,
        location: formData.location,
        venue: formData.venue,
        price: parseFloat(formData.price),
        capacity: parseInt(formData.capacity),
        image: formData.image || 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        status: 'published' as const,
      };

      createEvent(eventData);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to create event. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Sparkles className="h-12 w-12 text-primary-600 dark:text-primary-400 animate-pulse" />
                <div className="absolute inset-0 bg-primary-600 dark:bg-primary-400 rounded-full opacity-20 animate-ping"></div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Event</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Fill in the details to create your amazing event</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                    Basic Information
                  </h2>
                  <div className="space-y-4">
                    <Input
                      label="Event Title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter event title"
                      required
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Describe your event..."
                        rows={4}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400 focus:outline-none transition-colors duration-200"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400 focus:outline-none transition-colors duration-200"
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>

                    <Input
                      label="Tags"
                      value={formData.tags}
                      onChange={(e) => handleInputChange('tags', e.target.value)}
                      placeholder="Enter tags separated by commas"
                      icon={Tag}
                    />
                  </div>
                </Card>

                {/* Date & Time */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                    Date & Time
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Start Date & Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="datetime-local"
                        value={formData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400 focus:outline-none transition-colors duration-200"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        End Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        value={formData.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400 focus:outline-none transition-colors duration-200"
                      />
                    </div>
                  </div>
                </Card>

                {/* Location */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                    Location
                  </h2>
                  <div className="space-y-4">
                    <Input
                      label="City, State/Country"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="e.g., Kathmandu, Nepal"
                      icon={MapPin}
                      required
                    />
                    <Input
                      label="Venue Name"
                      value={formData.venue}
                      onChange={(e) => handleInputChange('venue', e.target.value)}
                      placeholder="e.g., Convention Center"
                      required
                    />
                  </div>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Event Creation Fee Notice */}
                <Card className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center mb-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
                    <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300">Event Creation Fee</h3>
                  </div>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400 mb-3">
                    A one-time fee of <strong>NPR {eventCreationFee.toLocaleString()}</strong> is required to publish your event on Planora.
                  </p>
                  <ul className="text-xs text-yellow-600 dark:text-yellow-500 space-y-1">
                    <li>• Event promotion on our platform</li>
                    <li>• Analytics and reporting tools</li>
                    <li>• Customer support</li>
                    <li>• Secure payment processing</li>
                  </ul>
                </Card>

                {/* Pricing & Capacity */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                    Pricing & Capacity
                  </h2>
                  <div className="space-y-4">
                    <Input
                      label="Ticket Price (NPR)"
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="0"
                      icon={DollarSign}
                      required
                    />
                    <Input
                      label="Capacity"
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => handleInputChange('capacity', e.target.value)}
                      placeholder="Maximum attendees"
                      icon={Users}
                      required
                    />
                  </div>
                </Card>

                {/* Event Image */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Image className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                    Event Image
                  </h2>
                  <Input
                    label="Image URL"
                    value={formData.image}
                    onChange={(e) => handleInputChange('image', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    icon={Image}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Leave empty to use a default image
                  </p>
                </Card>

                {/* Actions */}
                <Card className="p-6">
                  <div className="space-y-3">
                    {error && (
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                        {error}
                      </div>
                    )}
                    
                    <Button
                      type="submit"
                      className="w-full"
                      loading={isLoading}
                      icon={Save}
                    >
                      Pay NPR {eventCreationFee.toLocaleString()} & Create Event
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => navigate('/dashboard')}
                    >
                      Cancel
                    </Button>
                  </div>
                </Card>

                {/* Tips */}
                <Card className="p-6 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-primary-200 dark:border-primary-800">
                  <h3 className="text-sm font-semibold text-primary-900 dark:text-primary-300 mb-2 flex items-center">
                    <Sparkles className="h-4 w-4 mr-1" />
                    Tips for Success
                  </h3>
                  <ul className="text-xs text-primary-700 dark:text-primary-400 space-y-1">
                    <li>• Use a clear, descriptive title</li>
                    <li>• Add relevant tags for better discovery</li>
                    <li>• Set competitive pricing</li>
                    <li>• Choose an attractive venue</li>
                    <li>• Provide detailed description</li>
                  </ul>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={eventCreationFee}
        purpose="event_creation"
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
};

export default CreateEvent;