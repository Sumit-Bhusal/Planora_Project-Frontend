import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 dark:bg-dark-bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-primary-400" />
              <span className="font-bold text-xl">Planora</span>
            </div>
            <p className="text-gray-400 dark:text-dark-text-tertiary text-sm">
              The modern platform for creating, discovering, and managing events. 
              Connect with your audience and create memorable experiences.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 dark:text-dark-text-tertiary hover:text-primary-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 dark:text-dark-text-tertiary hover:text-primary-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 dark:text-dark-text-tertiary hover:text-primary-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 dark:text-dark-text-tertiary hover:text-primary-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/events" className="block text-gray-400 dark:text-dark-text-tertiary hover:text-white transition-colors">
                Browse Events
              </Link>
              <Link to="/create-event" className="block text-gray-400 dark:text-dark-text-tertiary hover:text-white transition-colors">
                Create Event
              </Link>
              <Link to="/pricing" className="block text-gray-400 dark:text-dark-text-tertiary hover:text-white transition-colors">
                Pricing
              </Link>
              <Link to="/help" className="block text-gray-400 dark:text-dark-text-tertiary hover:text-white transition-colors">
                Help Center
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Support</h3>
            <div className="space-y-2">
              <Link to="/contact" className="block text-gray-400 dark:text-dark-text-tertiary hover:text-white transition-colors">
                Contact Us
              </Link>
              <Link to="/faq" className="block text-gray-400 dark:text-dark-text-tertiary hover:text-white transition-colors">
                FAQ
              </Link>
              <Link to="/terms" className="block text-gray-400 dark:text-dark-text-tertiary hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/privacy" className="block text-gray-400 dark:text-dark-text-tertiary hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400 dark:text-dark-text-tertiary">
                <Mail className="h-4 w-4" />
                <span className="text-sm">support@planora.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400 dark:text-dark-text-tertiary">
                <Phone className="h-4 w-4" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400 dark:text-dark-text-tertiary">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 dark:border-dark-border-primary mt-8 pt-8 text-center">
          <p className="text-gray-400 dark:text-dark-text-tertiary text-sm">
            © 2024 Planora. All rights reserved. Built with ❤️ for event creators worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;