import React, { useState } from 'react';
import { X, AlertTriangle, DollarSign, Calendar, MapPin, User, CheckCircle, ArrowLeft, Info } from 'lucide-react';
import Button from '../UI/Button';
import Card from '../UI/Card';

interface TicketCancellationModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: {
    id: string;
    eventTitle: string;
    eventDate: Date;
    venue: string;
    location: string;
    ticketHolder: string;
    originalPrice: number;
    purchaseDate: Date;
  };
  onCancellationComplete: () => void;
}

const TicketCancellationModal: React.FC<TicketCancellationModalProps> = ({
  isOpen,
  onClose,
  ticket,
  onCancellationComplete
}) => {
  const [step, setStep] = useState<'confirm' | 'processing' | 'completed'>('confirm');
  const [cancellationReason, setCancellationReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const cancellationFee = ticket.originalPrice * 0.10; // 10% fee
  const refundAmount = ticket.originalPrice * 0.80; // 80% refund
  const platformFee = ticket.originalPrice * 0.10; // 10% platform fee

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

  const handleConfirmCancellation = async () => {
    setIsProcessing(true);
    setStep('processing');
    
    // Simulate processing time
    setTimeout(() => {
      setStep('completed');
      setIsProcessing(false);
      onCancellationComplete();
    }, 2000);
  };

  const handleClose = () => {
    setStep('confirm');
    setCancellationReason('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-dark-bg-secondary border-0 shadow-2xl animate-slide-up">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text-primary flex items-center">
              {step === 'confirm' && (
                <>
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-600 dark:text-red-400" />
                  Cancel Ticket
                </>
              )}
              {step === 'processing' && (
                <>
                  <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600 dark:text-yellow-400 animate-pulse" />
                  Processing Cancellation
                </>
              )}
              {step === 'completed' && (
                <>
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                  Cancellation Complete
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

          {step === 'confirm' && (
            <>
              {/* Warning Alert */}
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                      Cancellation Policy
                    </h3>
                    <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                      Cancelling this ticket will result in a 10% cancellation fee. You will receive 80% of the original amount as a refund.
                    </p>
                  </div>
                </div>
              </div>

              {/* Ticket Details */}
              <div className="bg-gray-50 dark:bg-dark-bg-tertiary rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-dark-text-primary mb-3">Ticket Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500 dark:text-dark-text-tertiary" />
                    <span className="text-gray-900 dark:text-dark-text-primary">{ticket.eventTitle}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500 dark:text-dark-text-tertiary" />
                    <span className="text-gray-600 dark:text-dark-text-secondary">{formatDate(ticket.eventDate)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500 dark:text-dark-text-tertiary" />
                    <span className="text-gray-600 dark:text-dark-text-secondary">{ticket.venue}, {ticket.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500 dark:text-dark-text-tertiary" />
                    <span className="text-gray-600 dark:text-dark-text-secondary">{ticket.ticketHolder}</span>
                  </div>
                </div>
              </div>

              {/* Refund Breakdown */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-dark-text-primary mb-3 flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                  Refund Breakdown
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-dark-text-secondary">Original Price:</span>
                    <span className="font-medium text-gray-900 dark:text-dark-text-primary">NPR {ticket.originalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-red-600 dark:text-red-400">
                    <span>Cancellation Fee (10%):</span>
                    <span className="font-medium">- NPR {cancellationFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 dark:text-dark-text-tertiary">
                    <span>Platform Fee (10%):</span>
                    <span className="font-medium">- NPR {platformFee.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-blue-200 dark:border-blue-800 pt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold text-green-600 dark:text-green-400">Refund Amount:</span>
                      <span className="font-bold text-lg text-green-600 dark:text-green-400">NPR {refundAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cancellation Reason */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-primary mb-2">
                  Reason for Cancellation (Optional)
                </label>
                <textarea
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  placeholder="Please let us know why you're cancelling this ticket..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border-primary rounded-lg bg-white dark:bg-dark-bg-tertiary text-gray-900 dark:text-dark-text-primary placeholder-gray-500 dark:placeholder-dark-text-tertiary focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent transition-all duration-200 resize-none"
                  rows={3}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                >
                  Keep Ticket
                </Button>
                <Button
                  onClick={handleConfirmCancellation}
                  className="flex-1 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                >
                  Confirm Cancellation
                </Button>
              </div>
            </>
          )}

          {step === 'processing' && (
            <div className="text-center py-8">
              <div className="relative mb-6">
                <AlertTriangle className="h-16 w-16 text-yellow-600 dark:text-yellow-400 mx-auto animate-pulse" />
                <div className="absolute inset-0 bg-yellow-600 dark:bg-yellow-400 rounded-full opacity-20 animate-ping"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-dark-text-primary mb-2">
                Processing Your Cancellation
              </h3>
              <p className="text-gray-600 dark:text-dark-text-secondary mb-6">
                Please wait while we process your ticket cancellation and initiate the refund...
              </p>
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-600 dark:border-yellow-400"></div>
                <span className="text-sm text-gray-600 dark:text-dark-text-secondary">Processing...</span>
              </div>
            </div>
          )}

          {step === 'completed' && (
            <div className="text-center py-8">
              <div className="relative mb-6">
                <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400 mx-auto animate-pulse" />
                <div className="absolute inset-0 bg-green-600 dark:bg-green-400 rounded-full opacity-20 animate-ping"></div>
              </div>
              <h3 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-2">
                🎉 Cancellation Successful!
              </h3>
              <p className="text-green-700 dark:text-green-400 mb-6">
                Your ticket has been cancelled and a refund of NPR {refundAmount.toLocaleString()} will be processed within 3-5 business days.
              </p>
              
              <div className="bg-white dark:bg-dark-bg-secondary rounded-lg p-4 mb-6 text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-dark-text-secondary">Event:</span>
                  <span className="font-medium text-gray-900 dark:text-dark-text-primary">{ticket.eventTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-dark-text-secondary">Ticket Holder:</span>
                  <span className="font-medium text-gray-900 dark:text-dark-text-primary">{ticket.ticketHolder}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-dark-text-secondary">Cancellation Fee:</span>
                  <span className="font-medium text-red-600 dark:text-red-400">NPR {cancellationFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 dark:border-dark-border-secondary pt-2">
                  <span className="font-bold text-gray-900 dark:text-dark-text-primary">Refund Amount:</span>
                  <span className="font-bold text-lg text-green-600 dark:text-green-400">NPR {refundAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                      Refund Information
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                      The refund will be credited to your original payment method within 3-5 business days. You will receive an email confirmation once the refund is processed.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleClose}
                className="w-full"
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default TicketCancellationModal; 