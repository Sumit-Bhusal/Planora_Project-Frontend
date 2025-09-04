import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";
import { useEvents } from "../../contexts/EventContext";
import { useAuth } from "../../contexts/AuthContext";
import { useCF } from "../../contexts/CFContext";
import { useNotification } from "../../contexts/NotificationContext";
import EventCard from "../../components/Events/EventCard";
import Input from "../../components/UI/Input";
import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";

const EventList: React.FC = () => {
  const { events, searchEvents, registerForEvent } = useEvents();
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const {
    recommendations,
    isLoading: mlLoading,
    trackView,
    trackRegistration,
    getAttendanceScore,
  } = useCF();

  // Keep all existing state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState<
    "date" | "price" | "popularity" | "relevance"
  >("relevance");
  const [showFilters, setShowFilters] = useState(false);
  const [relevanceScores, setRelevanceScores] = useState<{
    [key: string]: number;
  }>({});

  const categories = [
    "Technology",
    "Business",
    "Arts",
    "Sports",
    "Music",
    "Education",
  ];

  // Enhanced filtering with relevance
  const filteredAndSortedEvents = useMemo(() => {
    let filtered = searchQuery
      ? searchEvents(searchQuery, { category: selectedCategory })
      : events;

    if (selectedCategory) {
      filtered = filtered.filter(
        (event) => event.category === selectedCategory
      );
    }

    filtered = filtered.filter(
      (event) =>
        Number(event.ticketPrice) >= priceRange[0] &&
        Number(event.ticketPrice) <= priceRange[1]
    );

    // Enhanced sorting with relevance
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "relevance":
          const scoreA = relevanceScores[a.id] || 0;
          const scoreB = relevanceScores[b.id] || 0;
          if (scoreA !== scoreB) return scoreB - scoreA; // Higher relevance first
          return (b.currentAttendees ?? 0) - (a.currentAttendees ?? 0); // Fallback to popularity
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
  }, [
    events,
    searchQuery,
    selectedCategory,
    priceRange,
    sortBy,
    searchEvents,
    relevanceScores,
  ]);

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

  // Load relevance scores for visible events
  const loadRelevanceScores = async () => {
    if (user) {
      const visibleEvents = filteredAndSortedEvents.slice(0, 12);
      const scores: { [key: string]: number } = {};

      await Promise.all(
        visibleEvents.map(async (event) => {
          const score = await getAttendanceScore(event.id);
          if (score !== null) {
            scores[event.id] = score;
          }
        })
      );

      setRelevanceScores(scores);
    }
  };

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

  useEffect(() => {
    loadRelevanceScores();
  }, [filteredAndSortedEvents, user]);

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
                    onClick={() => handleRegister(event.id)}
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
              const relevanceScore = relevanceScores[event.id];
              const isHighMatch = relevanceScore && relevanceScore > 0.7;

              return (
                <div key={event.id} className="relative">
                  <div id={`event-${event.id}`}>
                    <EventCard
                      event={event}
                      variant={user?.role === "organizer" ? "organizer" : "user"}
                      onRegister={() => handleRegister(event.id)}
                      showActions={!!user}
                    />
                  </div>
                  {/* Natural indicators - no technical jargon */}
                  {user && isHighMatch && (
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      Great Match
                    </div>
                  )}
                  {user && relevanceScore && relevanceScore > 0.8 && (
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Hot Pick
                    </div>
                  )}
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
