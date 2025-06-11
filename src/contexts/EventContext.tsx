import React, { createContext, useContext, useState, useEffect } from 'react';
import { Event, EventAnalytics } from '../types';

interface EventContextType {
  events: Event[];
  userEvents: Event[];
  createEvent: (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'registeredCount'>) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  registerForEvent: (eventId: string) => void;
  getEventAnalytics: (eventId: string) => EventAnalytics | null;
  searchEvents: (query: string, filters?: { category?: string; date?: Date; location?: string }) => Event[];
  getRecommendedEvents: (userInterests: string[]) => Event[];
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

// Mock data for demonstration
const mockEvents: Event[] = [
  // Technology Events
  {
    id: '1',
    title: 'Tech Conference 2024',
    description: 'Join the biggest technology conference of the year featuring AI, blockchain, and web development.',
    organizer: {
      id: 'org1',
      email: 'organizer@techconf.com',
      name: 'Tech Conference Ltd',
      role: 'organizer',
      createdAt: new Date(),
    },
    category: 'Technology',
    date: new Date('2024-03-15T09:00:00'),
    endDate: new Date('2024-03-15T18:00:00'),
    location: 'Kathmandu, Nepal',
    venue: 'Bhrikutimandap Exhibition Hall',
    price: 2500,
    capacity: 1000,
    registeredCount: 750,
    image: 'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    tags: ['AI', 'Blockchain', 'Web Development', 'Networking'],
    status: 'published',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '2',
    title: 'AI & Machine Learning Summit',
    description: 'Explore the latest advancements in artificial intelligence and machine learning with industry experts.',
    organizer: {
      id: 'org2',
      email: 'info@aisummit.com',
      name: 'AI Innovations',
      role: 'organizer',
      createdAt: new Date(),
    },
    category: 'Technology',
    date: new Date('2024-04-20T10:00:00'),
    endDate: new Date('2024-04-20T17:00:00'),
    location: 'Pokhara, Nepal',
    venue: 'Pokhara Convention Center',
    price: 3500,
    capacity: 800,
    registeredCount: 650,
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    tags: ['AI', 'Machine Learning', 'Data Science', 'Innovation'],
    status: 'published',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-05'),
  },
  // Business Events
  {
    id: '3',
    title: 'Digital Marketing Summit',
    description: 'Learn the latest digital marketing strategies from industry experts.',
    organizer: {
      id: 'org3',
      email: 'info@marketingsummit.com',
      name: 'Marketing Pros',
      role: 'organizer',
      createdAt: new Date(),
    },
    category: 'Business',
    date: new Date('2024-03-22T10:00:00'),
    endDate: new Date('2024-03-22T17:00:00'),
    location: 'Lalitpur, Nepal',
    venue: 'Hotel Yak & Yeti',
    price: 1800,
    capacity: 500,
    registeredCount: 320,
    image: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    tags: ['Digital Marketing', 'SEO', 'Social Media', 'Analytics'],
    status: 'published',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    id: '4',
    title: 'Startup Pitch Competition',
    description: 'Watch innovative startups pitch their ideas to top investors and win funding.',
    organizer: {
      id: 'org4',
      email: 'events@startupfund.com',
      name: 'Startup Fund',
      role: 'organizer',
      createdAt: new Date(),
    },
    category: 'Business',
    date: new Date('2024-05-10T14:00:00'),
    endDate: new Date('2024-05-10T20:00:00'),
    location: 'Kathmandu, Nepal',
    venue: 'Soaltee Crowne Plaza',
    price: 1200,
    capacity: 300,
    registeredCount: 180,
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    tags: ['Startups', 'Investment', 'Entrepreneurship', 'Networking'],
    status: 'published',
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-20'),
  },
  // Arts Events
  {
    id: '5',
    title: 'Art & Design Workshop',
    description: 'Hands-on workshop exploring modern art techniques and digital design.',
    organizer: {
      id: 'org5',
      email: 'hello@artworkshop.com',
      name: 'Creative Studios',
      role: 'organizer',
      createdAt: new Date(),
    },
    category: 'Arts',
    date: new Date('2024-04-05T14:00:00'),
    endDate: new Date('2024-04-05T19:00:00'),
    location: 'Bhaktapur, Nepal',
    venue: 'Nepal Art Council',
    price: 800,
    capacity: 50,
    registeredCount: 35,
    image: 'https://images.pexels.com/photos/1153213/pexels-photo-1153213.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    tags: ['Art', 'Design', 'Creative', 'Workshop'],
    status: 'published',
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: '6',
    title: 'Contemporary Art Exhibition',
    description: 'Explore cutting-edge contemporary art from emerging and established artists.',
    organizer: {
      id: 'org6',
      email: 'curator@modernart.com',
      name: 'Modern Art Gallery',
      role: 'organizer',
      createdAt: new Date(),
    },
    category: 'Arts',
    date: new Date('2024-06-01T18:00:00'),
    endDate: new Date('2024-06-01T22:00:00'),
    location: 'Patan, Nepal',
    venue: 'Patan Museum',
    price: 500,
    capacity: 200,
    registeredCount: 120,
    image: 'https://images.pexels.com/photos/1839919/pexels-photo-1839919.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    tags: ['Contemporary Art', 'Exhibition', 'Gallery', 'Culture'],
    status: 'published',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-05'),
  },
  // Sports Events
  {
    id: '7',
    title: 'Marathon Training Camp',
    description: 'Intensive training camp for marathon runners with professional coaches.',
    organizer: {
      id: 'org7',
      email: 'coach@runningcamp.com',
      name: 'Elite Running Club',
      role: 'organizer',
      createdAt: new Date(),
    },
    category: 'Sports',
    date: new Date('2024-04-15T06:00:00'),
    endDate: new Date('2024-04-15T12:00:00'),
    location: 'Kathmandu, Nepal',
    venue: 'Tundikhel Ground',
    price: 1500,
    capacity: 100,
    registeredCount: 75,
    image: 'https://images.pexels.com/photos/2402777/pexels-photo-2402777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    tags: ['Marathon', 'Running', 'Training', 'Fitness'],
    status: 'published',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-15'),
  },
  {
    id: '8',
    title: 'Basketball Tournament',
    description: 'Annual community basketball tournament with prizes for winning teams.',
    organizer: {
      id: 'org8',
      email: 'events@basketballleague.com',
      name: 'Community Sports League',
      role: 'organizer',
      createdAt: new Date(),
    },
    category: 'Sports',
    date: new Date('2024-05-25T09:00:00'),
    endDate: new Date('2024-05-25T18:00:00'),
    location: 'Lalitpur, Nepal',
    venue: 'National Sports Council',
    price: 300,
    capacity: 400,
    registeredCount: 280,
    image: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    tags: ['Basketball', 'Tournament', 'Community', 'Competition'],
    status: 'published',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-15'),
  },
  // Music Events
  {
    id: '9',
    title: 'Jazz Festival',
    description: 'Three-day jazz festival featuring renowned artists and emerging talents.',
    organizer: {
      id: 'org9',
      email: 'info@jazzfest.com',
      name: 'Jazz Society',
      role: 'organizer',
      createdAt: new Date(),
    },
    category: 'Music',
    date: new Date('2024-07-12T19:00:00'),
    endDate: new Date('2024-07-14T23:00:00'),
    location: 'Kathmandu, Nepal',
    venue: 'Basantapur Durbar Square',
    price: 2000,
    capacity: 2000,
    registeredCount: 1500,
    image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    tags: ['Jazz', 'Music Festival', 'Live Music', 'Culture'],
    status: 'published',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: '10',
    title: 'Electronic Music Conference',
    description: 'Learn about electronic music production, DJing, and the music industry.',
    organizer: {
      id: 'org10',
      email: 'contact@emcconf.com',
      name: 'Electronic Music Collective',
      role: 'organizer',
      createdAt: new Date(),
    },
    category: 'Music',
    date: new Date('2024-06-20T10:00:00'),
    endDate: new Date('2024-06-20T18:00:00'),
    location: 'Pokhara, Nepal',
    venue: 'Pokhara Music Hall',
    price: 1800,
    capacity: 600,
    registeredCount: 420,
    image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    tags: ['Electronic Music', 'DJ', 'Production', 'Music Industry'],
    status: 'published',
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-25'),
  },
  // Education Events
  {
    id: '11',
    title: 'Science Fair',
    description: 'Annual science fair showcasing innovative projects from students and researchers.',
    organizer: {
      id: 'org11',
      email: 'admin@sciencefair.edu',
      name: 'Science Education Foundation',
      role: 'organizer',
      createdAt: new Date(),
    },
    category: 'Education',
    date: new Date('2024-04-30T09:00:00'),
    endDate: new Date('2024-04-30T16:00:00'),
    location: 'Kathmandu, Nepal',
    venue: 'Tribhuvan University',
    price: 200,
    capacity: 800,
    registeredCount: 600,
    image: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    tags: ['Science', 'Education', 'Research', 'Innovation'],
    status: 'published',
    createdAt: new Date('2024-01-30'),
    updatedAt: new Date('2024-02-05'),
  },
  {
    id: '12',
    title: 'Coding Bootcamp',
    description: 'Intensive weekend coding bootcamp for beginners to learn web development.',
    organizer: {
      id: 'org12',
      email: 'learn@codebootcamp.com',
      name: 'Code Academy',
      role: 'organizer',
      createdAt: new Date(),
    },
    category: 'Education',
    date: new Date('2024-05-18T09:00:00'),
    endDate: new Date('2024-05-19T17:00:00'),
    location: 'Lalitpur, Nepal',
    venue: 'Tech Hub Lalitpur',
    price: 3000,
    capacity: 40,
    registeredCount: 35,
    image: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    tags: ['Coding', 'Web Development', 'Programming', 'Bootcamp'],
    status: 'published',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-05'),
  },
];

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [userEvents, setUserEvents] = useState<Event[]>([]);

  const createEvent = (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'registeredCount'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Math.random().toString(36).substr(2, 9),
      registeredCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const updateEvent = (id: string, eventData: Partial<Event>) => {
    setEvents(prev => prev.map(event => 
      event.id === id ? { ...event, ...eventData, updatedAt: new Date() } : event
    ));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  const registerForEvent = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (event && !userEvents.find(e => e.id === eventId)) {
      setUserEvents(prev => [...prev, event]);
      setEvents(prev => prev.map(e => 
        e.id === eventId ? { ...e, registeredCount: e.registeredCount + 1 } : e
      ));
    }
  };

  const getEventAnalytics = (eventId: string): EventAnalytics | null => {
    const event = events.find(e => e.id === eventId);
    if (!event) return null;

    return {
      eventId,
      totalRegistrations: event.registeredCount,
      totalRevenue: event.registeredCount * event.price,
      attendanceRate: 0.85,
      demographicData: {
        ageGroups: { '18-25': 30, '26-35': 45, '36-45': 20, '46+': 5 },
        locations: { 'Kathmandu': 40, 'Pokhara': 25, 'Lalitpur': 15, 'Other': 20 },
        interests: { 'Technology': 60, 'Business': 25, 'Arts': 15 },
      },
      registrationTrend: [
        { date: new Date('2024-01-01'), count: 50 },
        { date: new Date('2024-02-01'), count: 150 },
        { date: new Date('2024-03-01'), count: event.registeredCount },
      ],
    };
  };

  const searchEvents = (query: string, filters?: { category?: string; date?: Date; location?: string }) => {
    return events.filter(event => {
      const matchesQuery = event.title.toLowerCase().includes(query.toLowerCase()) ||
                          event.description.toLowerCase().includes(query.toLowerCase()) ||
                          event.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
      
      const matchesCategory = !filters?.category || event.category === filters.category;
      const matchesLocation = !filters?.location || event.location.toLowerCase().includes(filters.location.toLowerCase());
      
      return matchesQuery && matchesCategory && matchesLocation;
    });
  };

  const getRecommendedEvents = (userInterests: string[]) => {
    return events.filter(event => 
      userInterests.some(interest => 
        event.tags.some(tag => tag.toLowerCase().includes(interest.toLowerCase())) ||
        event.category.toLowerCase().includes(interest.toLowerCase())
      )
    ).slice(0, 6);
  };

  return (
    <EventContext.Provider value={{
      events,
      userEvents,
      createEvent,
      updateEvent,
      deleteEvent,
      registerForEvent,
      getEventAnalytics,
      searchEvents,
      getRecommendedEvents,
    }}>
      {children}
    </EventContext.Provider>
  );
};