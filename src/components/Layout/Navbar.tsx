import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Calendar, User, LogOut, Menu, X, UserCog, Users, Moon, Sun, Plus, BarChart3, Settings, Bell, Target, Zap } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout, switchRole } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };

  const handleRoleSwitch = (newRole: 'user' | 'organizer') => {
    switchRole(newRole);
    setShowUserMenu(false);
    navigate('/dashboard');
  };

  const isActive = (path: string) => location.pathname === path;

  const isOrganizer = user?.role === 'organizer';

  return (
    <nav className={`backdrop-blur-md border-b sticky top-0 z-50 transition-all duration-300 ${
      'bg-gradient-to-r from-primary-50/90 to-purple-50/90 dark:from-primary-900/90 dark:to-purple-900/90 border-primary-200 dark:border-primary-700'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <Calendar className="h-8 w-8 text-primary-600 dark:text-primary-400 transition-all group-hover:scale-110 group-hover:rotate-12" />
                <div className="absolute inset-0 bg-primary-600 dark:bg-primary-400 rounded-full opacity-20 animate-pulse"></div>
              </div>
              <span className={`font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400`}>
                Planora
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="relative p-2 rounded-xl text-gray-600 dark:text-dark-text-secondary hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary transition-all duration-200 group"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <div className="relative">
                {isDark ? (
                  <Sun className="h-5 w-5 transform group-hover:rotate-180 transition-transform duration-300" />
                ) : (
                  <Moon className="h-5 w-5 transform group-hover:-rotate-12 transition-transform duration-300" />
                )}
                <div className="absolute inset-0 bg-primary-600 dark:bg-primary-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </div>
            </button>

            {user ? (
              <>
                {/* Role-specific navigation */}
                {isOrganizer ? (
                  // Organizer Navigation
                  <>
                    <Link
                      to="/dashboard"
                      className={`px-4 py-2 rounded-xl transition-all duration-200 transform hover:scale-105 ${
                        isActive('/dashboard')
                          ? 'text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/50 shadow-sm'
                          : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4" />
                        <span>Dashboard</span>
                      </div>
                    </Link>
                    <Link
                      to="/create-event"
                      className={`px-4 py-2 rounded-xl transition-all duration-200 transform hover:scale-105 ${
                        isActive('/create-event')
                          ? 'text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/50 shadow-sm'
                          : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Plus className="h-4 w-4" />
                        <span>Create Event</span>
                      </div>
                    </Link>
                    <Link
                      to="/events"
                      className={`px-4 py-2 rounded-xl transition-all duration-200 transform hover:scale-105 ${
                        isActive('/events')
                          ? 'text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/50 shadow-sm'
                          : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>Browse Events</span>
                      </div>
                    </Link>
                    <Link
                      to="/analytics"
                      className={`px-4 py-2 rounded-xl transition-all duration-200 transform hover:scale-105 ${
                        isActive('/analytics')
                          ? 'text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/50 shadow-sm'
                          : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="h-4 w-4" />
                        <span>Analytics</span>
                      </div>
                    </Link>
                  </>
                ) : (
                  // User Navigation
                  <>
                    <Link
                      to="/dashboard"
                      className={`px-4 py-2 rounded-xl transition-all duration-200 transform hover:scale-105 ${
                        isActive('/dashboard')
                          ? 'text-secondary-600 dark:text-secondary-400 bg-secondary-50 dark:bg-secondary-900/30 shadow-sm'
                          : 'text-gray-600 dark:text-dark-text-secondary hover:text-secondary-600 dark:hover:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-900/30'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>Dashboard</span>
                      </div>
                    </Link>
                    <Link
                      to="/events"
                      className={`px-4 py-2 rounded-xl transition-all duration-200 transform hover:scale-105 ${
                        isActive('/events')
                          ? 'text-secondary-600 dark:text-secondary-400 bg-secondary-50 dark:bg-secondary-900/30 shadow-sm'
                          : 'text-gray-600 dark:text-dark-text-secondary hover:text-secondary-600 dark:hover:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-900/30'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>Discover Events</span>
                      </div>
                    </Link>
                    <Link
                      to="/my-tickets"
                      className={`px-4 py-2 rounded-xl transition-all duration-200 transform hover:scale-105 ${
                        isActive('/my-tickets')
                          ? 'text-secondary-600 dark:text-secondary-400 bg-secondary-50 dark:bg-secondary-900/30 shadow-sm'
                          : 'text-gray-600 dark:text-dark-text-secondary hover:text-secondary-600 dark:hover:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-900/30'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>My Tickets</span>
                      </div>
                    </Link>
                  </>
                )}
                
                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary transition-all duration-200 transform hover:scale-105"
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full ring-2 ring-primary-200 dark:ring-dark-border-primary shadow-sm"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-dark-text-primary">{user.name}</span>
                    <div className={`px-2 py-1 text-xs rounded-full transition-all ${
                      isOrganizer 
                        ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-800 dark:text-primary-300 border border-primary-200 dark:border-primary-700' 
                        : 'bg-secondary-100 dark:bg-secondary-900/30 text-secondary-800 dark:text-secondary-400 border border-secondary-200 dark:border-secondary-700'
                    }`}>
                      {isOrganizer ? 'Organizer' : 'User'}
                    </div>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-dark-bg-secondary rounded-xl shadow-xl border border-gray-200 dark:border-dark-border-primary py-2 transition-all duration-200 animate-slide-up">
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-dark-border-secondary">
                        <p className="text-sm font-medium text-gray-900 dark:text-dark-text-primary">{user.name}</p>
                        <p className="text-sm text-gray-500 dark:text-dark-text-tertiary">{user.email}</p>
                      </div>
                      
                      <div className="py-2">
                        <p className="px-4 py-1 text-xs font-semibold text-gray-400 dark:text-dark-text-tertiary uppercase tracking-wider">
                          Switch Role
                        </p>
                        <button
                          onClick={() => handleRoleSwitch('user')}
                          className={`w-full text-left px-4 py-2 text-sm flex items-center space-x-2 transition-all hover:scale-105 ${
                            !isOrganizer 
                              ? 'text-secondary-600 dark:text-secondary-400 bg-secondary-50 dark:bg-secondary-900/30' 
                              : 'text-gray-700 dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary'
                          }`}
                        >
                          <Users className="h-4 w-4" />
                          <span>User Mode</span>
                        </button>
                        <button
                          onClick={() => handleRoleSwitch('organizer')}
                          className={`w-full text-left px-4 py-2 text-sm flex items-center space-x-2 transition-all hover:scale-105 ${
                            isOrganizer 
                              ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30' 
                              : 'text-gray-700 dark:text-dark-text-secondary hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary'
                          }`}
                        >
                          <UserCog className="h-4 w-4" />
                          <span>Organizer Mode</span>
                        </button>
                      </div>

                      <div className="border-t border-gray-100 dark:border-dark-border-secondary py-2">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all flex items-center space-x-2 hover:scale-105"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/events"
                  className="text-gray-600 dark:text-dark-text-secondary hover:text-primary-600 dark:hover:text-primary-400 px-4 py-2 rounded-xl transition-all duration-200 transform hover:scale-105"
                >
                  Browse Events
                </Link>
                <Link
                  to="/login"
                  className="text-gray-600 dark:text-dark-text-secondary hover:text-primary-600 dark:hover:text-primary-400 px-4 py-2 rounded-xl transition-all duration-200 transform hover:scale-105"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-500 dark:to-secondary-500 text-white px-6 py-2 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-gray-600 dark:text-dark-text-secondary hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary transition-all"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl text-gray-600 dark:text-dark-text-secondary hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary transition-all"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className={`md:hidden border-t animate-slide-up ${
          isOrganizer 
            ? 'bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900 dark:to-purple-900 border-primary-200 dark:border-primary-700'
            : 'bg-white dark:bg-dark-bg-primary border-gray-200 dark:border-dark-border-primary'
        }`}>
          <div className="px-4 py-2 space-y-2">
            {user ? (
              <>
                {isOrganizer ? (
                  // Organizer Mobile Navigation
                  <>
                    <Link
                      to="/dashboard"
                      className="block px-3 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4" />
                        <span>Dashboard</span>
                      </div>
                    </Link>
                    <Link
                      to="/create-event"
                      className="block px-3 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <Plus className="h-4 w-4" />
                        <span>Create Event</span>
                      </div>
                    </Link>
                    <Link
                      to="/events"
                      className="block px-3 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>Browse Events</span>
                      </div>
                    </Link>
                    <Link
                      to="/analytics"
                      className="block px-3 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="h-4 w-4" />
                        <span>Analytics</span>
                      </div>
                    </Link>
                  </>
                ) : (
                  // User Mobile Navigation
                  <>
                    <Link
                      to="/dashboard"
                      className="block px-3 py-2 rounded-xl text-gray-600 dark:text-dark-text-secondary hover:text-secondary-600 dark:hover:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-900/30 transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>Dashboard</span>
                      </div>
                    </Link>
                    <Link
                      to="/events"
                      className="block px-3 py-2 rounded-xl text-gray-600 dark:text-dark-text-secondary hover:text-secondary-600 dark:hover:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-900/30 transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>Discover Events</span>
                      </div>
                    </Link>
                    <Link
                      to="/my-tickets"
                      className="block px-3 py-2 rounded-xl text-gray-600 dark:text-dark-text-secondary hover:text-secondary-600 dark:hover:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-900/30 transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>My Tickets</span>
                      </div>
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/events"
                  className="block px-3 py-2 rounded-xl text-gray-600 dark:text-dark-text-secondary hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Browse Events
                </Link>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-xl text-gray-600 dark:text-dark-text-secondary hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="block px-3 py-2 rounded-xl text-white bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-500 dark:to-secondary-500 transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;