import React, { useState } from 'react';
import { Share2, Copy, Mail, Facebook, Twitter, Linkedin, Instagram, Link, CheckCircle, ExternalLink } from 'lucide-react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Input from '../UI/Input';

interface ShareEventProps {
  event: {
    id: string;
    title: string;
    description: string;
    date: Date;
    venue: string;
    location: string;
    image: string;
    price: number;
  };
  onClose: () => void;
}

const ShareEvent: React.FC<ShareEventProps> = ({ event, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [emailRecipients, setEmailRecipients] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const eventUrl = `${window.location.origin}/events/${event.id}`;
  const eventTitle = event.title;
  const eventDescription = `${event.description.substring(0, 100)}...`;
  const eventDate = event.date.toLocaleDateString();

  const shareData = {
    title: eventTitle,
    text: eventDescription,
    url: eventUrl,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = eventUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  const handleSocialShare = (platform: string) => {
    let url = '';
    const encodedUrl = encodeURIComponent(eventUrl);
    const encodedTitle = encodeURIComponent(eventTitle);
    const encodedDescription = encodeURIComponent(eventDescription);

    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=event,${eventTitle.replace(/\s+/g, '')}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'instagram':
        // Instagram doesn't support direct sharing via URL, so we copy the link
        handleCopyLink();
        alert('Link copied! You can now paste it in your Instagram story or post.');
        return;
      default:
        return;
    }

    window.open(url, '_blank', 'width=600,height=400');
  };

  const handleEmailShare = async () => {
    if (!emailRecipients.trim()) {
      alert('Please enter email addresses');
      return;
    }

    setIsSendingEmail(true);

    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock email sending
    const emailBody = `
Subject: Check out this amazing event: ${eventTitle}

Hi there!

I thought you might be interested in this event:

${eventTitle}
${eventDescription}

📅 Date: ${eventDate}
📍 Location: ${event.venue}, ${event.location}
💰 Price: NPR ${event.price.toLocaleString()}

${emailMessage}

You can register here: ${eventUrl}

Best regards,
Event Organizer
    `;

    // In a real app, this would send an actual email
    console.log('Email would be sent to:', emailRecipients);
    console.log('Email content:', emailBody);

    alert(`Email sent to ${emailRecipients.split(',').length} recipients!`);
    setIsSendingEmail(false);
    setEmailRecipients('');
    setEmailMessage('');
  };

  const shareOptions = [
    {
      name: 'Copy Link',
      icon: Copy,
      action: handleCopyLink,
      color: 'bg-gray-600 hover:bg-gray-700',
      description: 'Copy direct link to clipboard'
    },
    {
      name: 'Native Share',
      icon: Share2,
      action: handleNativeShare,
      color: 'bg-blue-600 hover:bg-blue-700',
      description: 'Use device share menu'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      action: () => handleSocialShare('facebook'),
      color: 'bg-blue-600 hover:bg-blue-700',
      description: 'Share on Facebook'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      action: () => handleSocialShare('twitter'),
      color: 'bg-sky-500 hover:bg-sky-600',
      description: 'Share on Twitter'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      action: () => handleSocialShare('linkedin'),
      color: 'bg-blue-700 hover:bg-blue-800',
      description: 'Share on LinkedIn'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      action: () => handleSocialShare('instagram'),
      color: 'bg-pink-600 hover:bg-pink-700',
      description: 'Copy link for Instagram'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-white dark:bg-gray-800">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Share Event</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{eventTitle}</p>
            </div>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Close
            </Button>
          </div>
        </div>

        <div className="p-6">
          {/* Event Preview */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-start space-x-4">
              <img 
                src={event.image} 
                alt={event.title}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-white">{event.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{eventDescription}</p>
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>📅 {eventDate}</span>
                  <span>📍 {event.venue}</span>
                  <span>💰 NPR {event.price.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Share Options */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Share Options</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {shareOptions.map((option) => (
                <button
                  key={option.name}
                  onClick={option.action}
                  className={`p-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all transform hover:scale-105 ${
                    copied && option.name === 'Copy Link' ? 'border-green-500 bg-green-50 dark:bg-green-900/30' : ''
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className={`p-3 rounded-full ${option.color} text-white`}>
                      {copied && option.name === 'Copy Link' ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <option.icon className="h-5 w-5" />
                      )}
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {copied && option.name === 'Copy Link' ? 'Copied!' : option.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Direct Link */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Direct Link</h3>
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Link className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={eventUrl}
                  readOnly
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <Button
                onClick={handleCopyLink}
                variant="outline"
                icon={copied ? CheckCircle : Copy}
                className="border-primary-200 dark:border-primary-700 text-primary-700 dark:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/30"
              >
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>

          {/* Email Share */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Share via Email</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Addresses (comma-separated)
                </label>
                <Input
                  placeholder="friend@example.com, colleague@example.com"
                  value={emailRecipients}
                  onChange={(e) => setEmailRecipients(e.target.value)}
                  icon={Mail}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Personal Message (optional)
                </label>
                <textarea
                  placeholder="Add a personal message..."
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>
              <Button
                onClick={handleEmailShare}
                loading={isSendingEmail}
                icon={Mail}
                className="w-full bg-primary-600 hover:bg-primary-700"
                disabled={!emailRecipients.trim()}
              >
                {isSendingEmail ? 'Sending...' : 'Send Email'}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ShareEvent; 