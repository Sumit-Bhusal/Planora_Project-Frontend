import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, BarChart3, Zap, ArrowRight, Star, CheckCircle, Sparkles, Rocket, Globe } from 'lucide-react';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';

const Landing: React.FC = () => {
  const features = [
    {
      icon: Calendar,
      title: 'Smart Event Creation',
      description: 'Create stunning events with our intuitive builder and AI-powered recommendations.',
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      icon: Users,
      title: 'Interest-Based Matching',
      description: 'Connect with your perfect audience through intelligent participant matching.',
      gradient: 'from-green-500 to-teal-600'
    },
    {
      icon: BarChart3,
      title: 'Predictive Analytics',
      description: 'Get insights into event performance and attendance predictions.',
      gradient: 'from-orange-500 to-red-600'
    },
    {
      icon: Zap,
      title: 'Instant Ticketing',
      description: 'Generate and distribute tickets instantly with QR code integration.',
      gradient: 'from-yellow-500 to-orange-600'
    }
  ];

  const stats = [
    { value: '50K+', label: 'Events Created', icon: Calendar },
    { value: '2M+', label: 'Attendees Connected', icon: Users },
    { value: '98%', label: 'Success Rate', icon: CheckCircle },
    { value: '24/7', label: 'Support Available', icon: Sparkles }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 dark:bg-yellow-500 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Rocket className="h-16 w-16 text-primary-600 dark:text-primary-400 animate-bounce" />
                <div className="absolute inset-0 bg-primary-600 dark:bg-primary-400 rounded-full opacity-20 animate-ping"></div>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Create <span className="bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400 bg-clip-text text-transparent animate-pulse">
                Unforgettable
              </span> Events
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              The modern platform that connects event organizers with their perfect audience. 
              From intimate workshops to large conferences, we make event management effortless with AI-powered insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" icon={ArrowRight} iconPosition="right" className="group">
                <Link to="/signup">
                  <span className="group-hover:mr-1 transition-all">Start Creating Events</span>
                </Link>
              </Button>
              <Button variant="outline" size="lg" icon={Globe}>
                <Link to="/events">Discover Events</Link>
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
              {stats.map((stat, index) => (
                <Card key={index} className="p-6 text-center hover:scale-105 transition-transform duration-300" hover>
                  <stat.icon className="h-8 w-8 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-4">
              <Sparkles className="h-12 w-12 text-primary-600 dark:text-primary-400 animate-pulse" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Powerful tools and intelligent features designed to make your events 
              more engaging and successful.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 text-center group" hover>
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How Planora Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Three simple steps to create amazing events
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create Your Event',
                description: 'Use our intuitive builder to create your event with all the details, pricing, and customization options.',
                icon: Calendar,
                color: 'from-blue-500 to-purple-600'
              },
              {
                step: '02',
                title: 'Reach Your Audience',
                description: 'Our AI matches your event with interested participants based on their preferences and behavior.',
                icon: Users,
                color: 'from-green-500 to-teal-600'
              },
              {
                step: '03',
                title: 'Manage & Analytics',
                description: 'Track registrations, manage attendees, and get insights to improve your future events.',
                icon: BarChart3,
                color: 'from-orange-500 to-red-600'
              }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-sm font-bold text-primary-600 dark:text-primary-400 mb-2">{item.step}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Trusted by Event Creators Worldwide
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Conference Organizer',
                content: 'Planora transformed how I manage my tech conferences. The analytics help me understand my audience better.',
                rating: 5,
                avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
              },
              {
                name: 'Mike Chen',
                role: 'Workshop Leader',
                content: 'The interest-based matching is incredible. I now get participants who are genuinely excited about my workshops.',
                rating: 5,
                avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
              },
              {
                name: 'Lisa Rodriguez',
                role: 'Community Manager',
                content: 'From small meetups to large events, Planora scales perfectly. The ticketing system is seamless.',
                rating: 5,
                avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
              }
            ].map((testimonial, index) => (
              <Card key={index} className="p-6 hover:scale-105 transition-transform duration-300" hover>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-500 dark:to-secondary-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Sparkles className="h-16 w-16 text-white mx-auto mb-6 animate-pulse" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Create Your Next Event?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of successful event creators who trust Planora
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" icon={Rocket}>
              <Link to="/signup">Get Started Free</Link>
            </Button>
            <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-primary-600" icon={Globe}>
              <Link to="/events">Browse Events</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;