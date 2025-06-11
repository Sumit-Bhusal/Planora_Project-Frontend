import React, { useState } from 'react';
import { X, User, Mail, Phone, Calendar, MapPin, Download, Sparkles, CheckCircle } from 'lucide-react';
import { Event } from '../../types';
import { useTickets } from '../../contexts/TicketContext';
import Button from '../UI/Button';
import Input from '../UI/Input';
import Card from '../UI/Card';
import PaymentModal from '../Payment/PaymentModal';
import TicketDownload from './TicketDownload';

interface TicketBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
  onBookingComplete: () => void;
}

interface BookingForm {
  fullName: string;
  email: string;
  phone: string;
  age: string;
  emergencyContact: string;
}

const TicketBookingModal: React.FC<TicketBookingModalProps> = ({
  isOpen,
  onClose,
  event,
  onBookingComplete
}) => {
  const { addTicket } = useTickets();
  const [step, setStep] = useState<'details' | 'payment' | 'ticket'>('details');
  const [formData, setFormData] = useState<BookingForm>({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    emergencyContact: ''
  });
  const [errors, setErrors] = useState<Partial<BookingForm>>({});
  const [ticketId, setTicketId] = useState<string>('');
  const [showTicketDownload, setShowTicketDownload] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (field: keyof BookingForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<BookingForm> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.age.trim()) newErrors.age = 'Age is required';
    else if (parseInt(formData.age) < 1 || parseInt(formData.age) > 120) newErrors.age = 'Invalid age';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedToPayment = () => {
    if (validateForm()) {
      setStep('payment');
    }
  };

  const handlePaymentSuccess = () => {
    const newTicketId = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    setTicketId(newTicketId);
    
    // Add ticket to the context with booking details
    addTicket({
      eventId: event.id,
      eventTitle: event.title,
      eventDate: event.date,
      venue: event.venue,
      location: event.location,
      organizer: event.organizer.name,
      originalPrice: event.price,
      bookingDetails: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        age: formData.age,
        emergencyContact: formData.emergencyContact || undefined,
      },
    });
    
    setStep('ticket');
    onBookingComplete();
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const handleClose = () => {
    setStep('details');
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      age: '',
      emergencyContact: ''
    });
    setErrors({});
    setTicketId('');
    setShowTicketDownload(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-dark-bg-secondary border-0 shadow-2xl animate-slide-up">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text-primary flex items-center">
                {step === 'details' && (
                  <>
                    <Sparkles className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400 animate-pulse" />
                    Book Your Ticket
                  </>
                )}
                {step === 'payment' && (
                  <>
                    <Sparkles className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                    Payment
                  </>
                )}
                {step === 'ticket' && (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600 dark:text-green-400 animate-pulse" />
                    Your Digital Ticket
                  </>
                )}
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-dark-text-secondary transition-colors hover:scale-110 transform"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {step === 'details' && (
              <>
                {/* Event Summary */}
                <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-dark-bg-tertiary dark:to-dark-bg-quaternary rounded-xl p-4 mb-6 border border-primary-100 dark:border-dark-border-primary">
                  <div className="flex items-start space-x-4">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-20 h-20 rounded-lg object-cover ring-2 ring-primary-200 dark:ring-dark-border-primary shadow-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-dark-text-primary">{event.title}</h3>
                      <div className="flex items-center text-sm text-gray-600 dark:text-dark-text-secondary mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-dark-text-secondary mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{event.venue}, {event.location}</span>
                      </div>
                      <div className="text-lg font-semibold text-primary-600 dark:text-primary-400 mt-2">
                        NPR {event.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Booking Form */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900 dark:text-dark-text-primary flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Personal Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      icon={User}
                      error={errors.fullName}
                      required
                      placeholder="Enter your full name"
                    />
                    <Input
                      label="Age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      error={errors.age}
                      required
                      placeholder="Enter your age"
                    />
                  </div>

                  <Input
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    icon={Mail}
                    error={errors.email}
                    required
                    placeholder="Enter your email"
                  />

                  <Input
                    label="Phone Number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    icon={Phone}
                    error={errors.phone}
                    required
                    placeholder="Enter your phone number"
                  />

                  <Input
                    label="Emergency Contact"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                    icon={Phone}
                    placeholder="Emergency contact number (optional)"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleProceedToPayment}
                    className="flex-1"
                    icon={Sparkles}
                  >
                    Proceed to Payment
                  </Button>
                </div>
              </>
            )}

            {step === 'ticket' && (
              <div className="text-center">
                {/* Success Message */}
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-6">
                  <div className="flex items-center justify-center mb-4">
                    <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-2">
                    🎉 Booking Successful!
                  </h3>
                  <p className="text-green-700 dark:text-green-400 mb-4">
                    Your ticket has been generated successfully. You can now download your receipt.
                  </p>
                  <div className="bg-white dark:bg-dark-bg-secondary rounded-lg p-4 text-left space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-dark-text-secondary">Event:</span>
                      <span className="font-medium text-gray-900 dark:text-dark-text-primary">{event.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-dark-text-secondary">Ticket Holder:</span>
                      <span className="font-medium text-gray-900 dark:text-dark-text-primary">{formData.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-dark-text-secondary">Ticket ID:</span>
                      <span className="font-mono text-sm text-gray-900 dark:text-dark-text-primary">{ticketId}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 dark:border-dark-border-secondary pt-2">
                      <span className="text-gray-600 dark:text-dark-text-secondary">Total Paid:</span>
                      <span className="font-bold text-green-600 dark:text-green-400">NPR {event.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={() => setShowTicketDownload(true)}
                    icon={Download}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transform hover:scale-105 transition-all"
                  >
                    Download Receipt
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    className="flex-1"
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={step === 'payment'}
        onClose={() => setStep('details')}
        amount={event.price}
        purpose="ticket_booking"
        onSuccess={handlePaymentSuccess}
        eventTitle={event.title}
      />

      {/* Ticket Download Modal */}
      {showTicketDownload && (
        <TicketDownload
          event={{
            title: event.title,
            date: event.date,
            venue: event.venue,
            location: event.location,
            price: event.price,
            organizer: event.organizer.name
          }}
          ticketHolder={{
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone
          }}
          ticketId={ticketId}
          paymentMethod="Credit Card"
          onClose={() => setShowTicketDownload(false)}
        />
      )}
    </>
  );
};

export default TicketBookingModal;