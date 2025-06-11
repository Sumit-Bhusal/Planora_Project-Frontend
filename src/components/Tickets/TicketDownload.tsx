import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Download, X, Receipt, Calendar, MapPin, User, DollarSign, CheckCircle } from 'lucide-react';
import Button from '../UI/Button';

interface TicketDownloadProps {
  event: {
    title: string;
    date: Date;
    venue: string;
    location: string;
    price: number;
    organizer: string;
  };
  ticketHolder: {
    fullName: string;
    email: string;
    phone: string;
  };
  ticketId: string;
  paymentMethod?: string;
  onClose?: () => void;
}

const TicketDownload: React.FC<TicketDownloadProps> = ({
  event,
  ticketHolder,
  ticketId,
  paymentMethod = "Credit Card",
  onClose
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    if (!ticketRef.current) return;
    
    setIsDownloading(true);
    try {
      // Generate canvas from the ticket content
      const canvas = await html2canvas(ticketRef.current, {
        background: '#ffffff',
        width: 400,
        height: 600,
        useCORS: true
      });

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      
      // Calculate dimensions to fit on A4
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = 160; // mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Center the image on the page
      const x = (pdfWidth - imgWidth) / 2;
      const y = (pdfHeight - imgHeight) / 2;
      
      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      pdf.save(`ticket-${ticketId}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsDownloading(false);
    }
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

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-bg-secondary rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-border-primary">
          <div className="flex items-center space-x-2">
            <Receipt className="h-6 w-6 text-green-600 dark:text-green-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-dark-text-primary">
              Payment Receipt
            </h2>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-dark-text-secondary transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Receipt Content */}
        <div className="p-6">
          <div
            ref={ticketRef}
            className="bg-white border-2 border-gray-200 rounded-lg p-6 max-w-sm mx-auto"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-2">
                <Receipt className="h-8 w-8 text-green-600 mr-2" />
                <h1 className="text-2xl font-bold text-gray-900">
                  PLANORA
                </h1>
              </div>
              <p className="text-sm text-gray-600 uppercase tracking-wider">
                Event Ticket & Receipt
              </p>
              <div className="mt-2 flex items-center justify-center space-x-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Payment Successful</span>
              </div>
            </div>

            {/* Event Details */}
            <div className="mb-6">
              <h3 className="font-bold text-lg text-gray-900 mb-3 border-b border-gray-200 pb-2">
                Event Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">{event.title}</p>
                    <p className="text-gray-600">{formatDate(event.date)}</p>
                    <p className="text-gray-500">Time: {formatTime(event.date)}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">{event.venue}</p>
                    <p className="text-gray-600">{event.location}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <User className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Organizer</p>
                    <p className="text-gray-600">{event.organizer}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket Holder Details */}
            <div className="mb-6">
              <h3 className="font-bold text-lg text-gray-900 mb-3 border-b border-gray-200 pb-2">
                Ticket Holder
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-900">{ticketHolder.fullName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">{ticketHolder.email}</span>
                </div>
                {ticketHolder.phone && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">{ticketHolder.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Details */}
            <div className="mb-6">
              <h3 className="font-bold text-lg text-gray-900 mb-3 border-b border-gray-200 pb-2">
                Payment Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Ticket Price:</span>
                  <span className="font-medium text-gray-900">NPR {event.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium text-gray-900">{paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-mono text-xs text-gray-900">{ticketId}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">Total Paid:</span>
                    <span className="font-bold text-lg text-green-600">NPR {event.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket ID */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                Ticket ID
              </p>
              <p className="font-mono text-sm font-bold text-gray-900">
                {ticketId}
              </p>
            </div>

            {/* Footer */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">
                This is your official event ticket and payment receipt.
              </p>
              <p className="text-xs text-gray-400">
                Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center p-6 border-t border-gray-200 dark:border-dark-border-primary">
          <Button
            onClick={downloadPDF}
            disabled={isDownloading}
            className="flex items-center space-x-2 min-w-[140px]"
          >
            <Download className="h-4 w-4" />
            <span>{isDownloading ? 'Generating...' : 'Download Receipt'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TicketDownload;
