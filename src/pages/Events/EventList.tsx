import React, { useState, useMemo, useEffect } from "react";
import { Search, SlidersHorizontal, Star } from "lucide-react";
import { useEvents } from "../../contexts/EventContext";
import { useAuth } from "../../contexts/AuthContext";
import { useCF } from "../../contexts/CFContext";
import { useNotification } from "../../contexts/NotificationContext";
import EventCard from "../../components/Events/EventCard";
import Input from "../../components/UI/Input";
import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import { useNavigate } from "react-router-dom";

const EventList: React.FC = () => {
  const { events, searchEvents, registerForEvent } = useEvents();
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const { recommendations, trackView, trackRegistration } = useCF();
  const navigate = useNavigate();

  // Keep all existing state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState<
    "date" | "price" | "popularity" | "relevance"
  >("relevance");
  const [showFilters, setShowFilters] = useState(false);
  // Removed relevanceScores state

  const categories = [
    "Technology",
    "Business",
    "Arts",
    "Sports",
    "Music",
    "Education",
  ];

  // Filtering and sorting without relevance
  const filteredAndSortedEvents = useMemo(() => {
    let filtered = events;

    // Only apply search if there is a query
    if (searchQuery) {
      filtered = searchEvents(searchQuery, { category: selectedCategory });
    }

    // Only apply category filter if selected
    if (selectedCategory) {
      filtered = filtered.filter(
        (event) => event.category === selectedCategory
      );
    }

    // Only apply price filter if user changed it from default
    const isDefaultPrice = priceRange[0] === 0 && priceRange[1] === 1000;
    if (!isDefaultPrice) {
      filtered = filtered.filter((event) => {
        const price = event.ticketPrice;
        if (typeof price === "string") {
          if ((price as string).toLowerCase() === "free") return true;
          const priceNum = Number(price);
          return (
            !isNaN(priceNum) &&
            priceNum >= priceRange[0] &&
            priceNum <= priceRange[1]
          );
        }
        if (typeof price === "number") {
          return price >= priceRange[0] && price <= priceRange[1];
        }
        return false;
      });
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return (
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          );
        case "price":
          return Number(a.ticketPrice) - Number(b.ticketPrice);
        case "popularity":
          return (b.currentAttendees ?? 0) - (a.currentAttendees ?? 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [events, searchQuery, selectedCategory, priceRange, sortBy, searchEvents]);

  // Enhanced register function
  const handleRegister = async (eventId: string) => {
    if (user) {
      registerForEvent(eventId);
      await trackRegistration(eventId);

      addNotification({
        type: "success",
        title: "Registration Successful!",
        message: "We'll keep improving your event suggestions",
      });
    }
  };

  // Removed loadRelevanceScores

  // Track views with intersection observer
  useEffect(() => {
    if (!user) return;

    const observers = new Map();

    filteredAndSortedEvents.slice(0, 6).forEach((event) => {
      const element = document.getElementById(`event-${event.id}`);
      if (element && !observers.has(event.id)) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              trackView(event.id);
              observer.disconnect();
              observers.delete(event.id);
            }
          },
          { threshold: 0.5 }
        );
        observer.observe(element);
        observers.set(event.id, observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [filteredAndSortedEvents, user, trackView]);

  // Removed useEffect for relevance scores

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg-primary transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text-primary mb-2">
            Discover Events
          </h1>
          <p className="text-gray-600 dark:text-dark-text-secondary">
            Find events that match your interests and passions
          </p>
        </div>

        {/* Show personalized picks if user is logged in and has recommendations */}
        {user && recommendations.length > 0 && (
          <Card className="p-6 mb-8 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text-primary mb-4 flex items-center">
              <Star className="h-5 w-5 mr-2 text-yellow-500" />
              Picked Just for You
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {recommendations.slice(0, 4).map((event) => (
                <div
                  key={event.id}
                  className="relative bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm"
                >
                  <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 mb-1">
                    {event.title}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                    {event.category}
                  </p>
                  <Button
                    size="sm"
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500"
                    onClick={() => {
                      // Track only a view here; don’t auto-register
                      trackView(event.id);
                      // Navigate to the details/registration preview with state
                      navigate('/events/register', { state: { event } });
                    }}
                  >
                    View Details
                  </Button>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
              These events match your interests and attendance patterns
            </p>
          </Card>
        )}

        {/* Search and Filters - keep exactly as is */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search events, topics, or organizers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={Search}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                icon={SlidersHorizontal}
              >
                Filters
              </Button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 dark:border-dark-border-primary rounded-lg bg-white dark:bg-dark-bg-tertiary text-gray-900 dark:text-dark-text-primary focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400 transition-colors"
              >
                {user && <option value="relevance">Best Match</option>}
                <option value="date">Sort by Date</option>
                <option value="price">Sort by Price</option>
                <option value="popularity">Most Popular</option>
              </select>
            </div>
          </div>

          {/* Keep existing filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-dark-border-primary">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-primary mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border-primary rounded-lg bg-white dark:bg-dark-bg-tertiary text-gray-900 dark:text-dark-text-primary focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400 transition-colors"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-primary mb-2">
                    Price Range
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([Number(e.target.value), priceRange[1]])
                      }
                      className="w-20 px-3 py-2 border border-gray-300 dark:border-dark-border-primary rounded-lg bg-white dark:bg-dark-bg-tertiary text-gray-900 dark:text-dark-text-primary focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400 transition-colors"
                    />
                    <span className="text-gray-500 dark:text-dark-text-tertiary">
                      -
                    </span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], Number(e.target.value)])
                      }
                      className="w-20 px-3 py-2 border border-gray-300 dark:border-dark-border-primary rounded-lg bg-white dark:bg-dark-bg-tertiary text-gray-900 dark:text-dark-text-primary focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedCategory("");
                      setPriceRange([0, 1000]);
                      setSearchQuery("");
                    }}
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Keep existing category pills */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setSelectedCategory("")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === ""
                ? "bg-primary-600 dark:bg-primary-500 text-white"
                : "bg-white dark:bg-dark-bg-secondary text-gray-700 dark:text-dark-text-primary border border-gray-300 dark:border-dark-border-primary hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary"
            }`}
          >
            All Events
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-primary-600 dark:bg-primary-500 text-white"
                  : "bg-white dark:bg-dark-bg-secondary text-gray-700 dark:text-dark-text-primary border border-gray-300 dark:border-dark-border-primary hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Results header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600 dark:text-dark-text-secondary">
            Showing {filteredAndSortedEvents.length} events
            {searchQuery && (
              <span>
                {" "}
                for &quot;
                <span className="font-medium text-gray-900 dark:text-dark-text-primary">
                  {searchQuery}
                </span>
                &quot;
              </span>
            )}
            {user && sortBy === "relevance" && (
              <span className="text-purple-600 dark:text-purple-400 ml-2">
                • Sorted by relevance to you
              </span>
            )}
          </p>
        </div>

        {/* Events Grid */}
        {filteredAndSortedEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedEvents.map((event) => {
              // Determine variant and actions based on user role and ownership
              const isEventOwner = user?.role === "organizer" && event.organizer?.id === user.id;
              const isOrganizer = user?.role === "organizer";
              
              // Organizers can only manage their own events, no registration
              // Users can register for any event
              let variant: "user" | "organizer" = "user";
              let showActions = !!user;
              
              if (isEventOwner) {
                variant = "organizer"; // Show edit/delete for owned events
              } else if (isOrganizer) {
                showActions = false; // Organizers can't register for other events, show read-only
              }
              
              return (
                <div key={event.id} className="relative">
                  <div id={`event-${event.id}`}>
                    <EventCard
                      event={event}
                      variant={variant}
                      onRegister={() => handleRegister(event.id)}
                      showActions={showActions}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Search className="h-12 w-12 text-gray-400 dark:text-dark-text-tertiary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text-primary mb-2">
              No events found
            </h3>
            <p className="text-gray-500 dark:text-dark-text-tertiary mb-6">
              Try adjusting your search criteria or browse all events
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("");
                setPriceRange([0, 1000]);
              }}
            >
              Clear All Filters
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EventList;
