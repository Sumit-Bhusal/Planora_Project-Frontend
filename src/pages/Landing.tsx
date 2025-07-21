import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, BarChart3, Zap, ArrowRight, Star, CheckCircle, Sparkles, Rocket, Globe } from 'lucide-react';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import eventImg from '../assets/event.jpg';
import MeshBG from '../assets/mesh-bg.png';
import BackgroundImg from '../assets/Background.png';

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

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 min-h-[70vh] flex items-center">
        {/* Full background image */}
        <img src={eventImg} alt="Event" className="absolute inset-0 w-full h-full object-cover z-0" />
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-blue-100/60 dark:from-gray-900/80 dark:via-purple-900/60 dark:to-blue-900/60 z-10" />
        {/* Hero Content */}
        <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)] mb-6">
            Create <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-pulse drop-shadow-[0_2px_12px_rgba(255,255,255,0.8)]">
                Unforgettable
              </span> Events
            </h1>
          <p className="text-xl text-white font-semibold mb-8 max-w-3xl mx-auto drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
              The modern platform that connects event organizers with their perfect audience. 
            From intimate workshops to large conferences, we make event management effortless with <span className="text-primary-200 font-bold">AI-powered insights</span>.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" icon={ArrowRight} iconPosition="right" className="group bg-primary-600 hover:bg-primary-700 text-white font-bold shadow-lg shadow-primary-500/30 border-2 border-white/40 backdrop-blur-md">
                <Link to="/signup">
                  <span className="group-hover:mr-1 transition-all">Start Creating Events</span>
                </Link>
              </Button>
            <Button variant="outline" size="lg" icon={Globe} className="bg-white/80 hover:bg-white text-primary-700 font-bold border-2 border-primary-400 shadow-lg shadow-primary-400/20">
              <Link to="/signup">Discover Events</Link>
              </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative overflow-hidden">
        <img src={BackgroundImg} alt="Decorative Background" className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
      <section className="py-20 relative overflow-hidden bg-gray-50 dark:bg-gray-800">
        <img src={BackgroundImg} alt="Decorative Background" className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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

      {/* Vision/Mission Section */}
      <section className="py-12 relative flex justify-center items-center bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50 dark:from-gray-900 dark:via-blue-900/40 dark:to-purple-900/40 overflow-hidden">
        {/* Mesh or animated background */}
        <img src={MeshBG} alt="Mesh" className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none z-0" />
        <div className="max-w-3xl w-full mx-auto p-8 rounded-3xl shadow-xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-md z-10 border border-white/30 dark:border-gray-700/40">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-primary-600 dark:text-primary-400 mb-4">Our Vision</h2>
          <p className="text-lg text-gray-700 dark:text-gray-200 text-center">
            Planora is on a mission to revolutionize event management with smart, AI-driven tools that empower organizers and delight attendees.
          </p>
          </div>
      </section>

      {/* Who Is It For Section */}
      <section className="py-12 relative bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 dark:from-gray-900 dark:via-purple-900/40 dark:to-blue-900/40 overflow-hidden">
        <img src={MeshBG} alt="Mesh" className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none z-0" />
        <div className="max-w-6xl mx-auto px-4 z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">Who Is Planora For?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Users, title: 'Event Organizers', desc: 'Effortlessly manage and promote your events.' },
              { icon: Calendar, title: 'Community Managers', desc: 'Engage your audience and grow your community.' },
              { icon: BarChart3, title: 'Workshop Leaders', desc: 'Reach participants who are truly interested.' }
            ].map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl shadow-lg bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border border-white/30 dark:border-gray-700/40 flex flex-col items-center hover:scale-105 transition-transform duration-300 animate-fade-in">
                <item.icon className="h-10 w-10 text-primary-600 dark:text-primary-400 mb-4 animate-bounce" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-center">{item.desc}</p>
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Trust Section */}
      <section className="py-12 relative flex justify-center items-center bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50 dark:from-gray-900 dark:via-blue-900/40 dark:to-purple-900/40 overflow-hidden">
        <img src={MeshBG} alt="Mesh" className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none z-0" />
        <div className="max-w-2xl w-full mx-auto p-8 rounded-3xl shadow-xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-md z-10 border border-white/30 dark:border-gray-700/40 flex flex-col items-center animate-fade-in">
          <CheckCircle className="h-12 w-12 text-green-500 mb-4 animate-pulse" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Security & Privacy</h2>
          <p className="text-gray-700 dark:text-gray-200 text-center">Your data is secure with us. Planora uses industry-standard encryption and privacy practices to keep your information safe.</p>
        </div>
      </section>
    </div>
  );
};

export default Landing;