import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, DollarSign, Users, Image, Tag, Save } from 'lucide-react';
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
  // const [showPaymentModal, setShowPaymentModal] = useState(false); // Remove this line

  const categories = ['Technology', 'Business', 'Arts', 'Sports', 'Music', 'Education'];
  // const eventCreationFee = 10000; // NPR 10,000 (remove this line)

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

    // Directly create the event (remove payment modal logic)
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

  // Remove all references to showPaymentModal, handlePaymentSuccess, and payment modal UI.

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
            <p className="text-gray-600 mt-2">Fill in the details to create your event</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
                  <div className="space-y-4">
                    <Input
                      label="Event Title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter event title"
                      required
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Describe your event..."
                        rows={4}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
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
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Date & Time</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date & Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="datetime-local"
                        value={formData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        value={formData.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </Card>

                {/* Location */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
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
                <Card className="p-6 bg-yellow-50 border-yellow-200">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">Event Creation Fee</h3>
                  <p className="text-sm text-yellow-700 mb-3">
                    A one-time fee of <strong>NPR {/* eventCreationFee.toLocaleString() */}</strong> is required to publish your event on Planora.
                  </p>
                  <ul className="text-xs text-yellow-600 space-y-1">
                    <li>• Event promotion on our platform</li>
                    <li>• Analytics and reporting tools</li>
                    <li>• Customer support</li>
                    <li>• Secure payment processing</li>
                  </ul>
                </Card>

                {/* Pricing & Capacity */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Pricing & Capacity</h2>
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
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Event Image</h2>
                  <Input
                    label="Image URL"
                    value={formData.image}
                    onChange={(e) => handleInputChange('image', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    icon={Image}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Leave empty to use a default image
                  </p>
                </Card>

                {/* Actions */}
                <Card className="p-6">
                  <div className="space-y-3">
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                        {error}
                      </div>
                    )}
                    
                    <Button
                      type="submit"
                      className="w-full"
                      loading={isLoading}
                      icon={Save}
                    >
                      Pay NPR {/* eventCreationFee.toLocaleString() */} & Create Event
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
                <Card className="p-6 bg-primary-50 border-primary-200">
                  <h3 className="text-sm font-semibold text-primary-900 mb-2">💡 Tips for Success</h3>
                  <ul className="text-xs text-primary-700 space-y-1">
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
      {/* Remove all references to showPaymentModal, handlePaymentSuccess, and payment modal UI. */}
    </>
  );
};

export default CreateEvent;