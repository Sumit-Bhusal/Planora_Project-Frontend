import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface UserTicket {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: Date;
  venue: string;
  location: string;
  organizer: string;
  originalPrice: number;
  purchaseDate: Date;
  status: 'active' | 'cancelled' | 'used';
  ticketId: string;
  // Booking details from registration form
  bookingDetails: {
    fullName: string;
    email: string;
    phone: string;
    age: string;
    emergencyContact?: string;
  };
}

interface TicketContextType {
  userTickets: UserTicket[];
  addTicket: (ticket: Omit<UserTicket, 'id' | 'ticketId' | 'purchaseDate' | 'status'>) => void;
  cancelTicket: (ticketId: string) => void;
  getTicketById: (ticketId: string) => UserTicket | undefined;
  getTicketsByEventId: (eventId: string) => UserTicket[];
  getActiveTickets: () => UserTicket[];
  getCancelledTickets: () => UserTicket[];
  getUsedTickets: () => UserTicket[];
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
};

export const TicketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [userTickets, setUserTickets] = useState<UserTicket[]>([]);

  // Load tickets from localStorage on mount
  useEffect(() => {
    if (user) {
      const savedTickets = localStorage.getItem(`tickets_${user.id}`);
      if (savedTickets) {
        try {
          const parsedTickets = JSON.parse(savedTickets).map((ticket: any) => ({
            ...ticket,
            eventDate: new Date(ticket.eventDate),
            purchaseDate: new Date(ticket.purchaseDate),
          }));
          setUserTickets(parsedTickets);
        } catch (error) {
          console.error('Error loading tickets from localStorage:', error);
        }
      }
    }
  }, [user]);

  // Save tickets to localStorage whenever they change
  useEffect(() => {
    if (user && userTickets.length > 0) {
      localStorage.setItem(`tickets_${user.id}`, JSON.stringify(userTickets));
    }
  }, [userTickets, user]);

  const addTicket = (ticketData: Omit<UserTicket, 'id' | 'ticketId' | 'purchaseDate' | 'status'>) => {
    const newTicket: UserTicket = {
      ...ticketData,
      id: Math.random().toString(36).substr(2, 9),
      ticketId: `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      purchaseDate: new Date(),
      status: 'active',
    };
    setUserTickets(prev => [...prev, newTicket]);
  };

  const cancelTicket = (ticketId: string) => {
    setUserTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, status: 'cancelled' as const }
        : ticket
    ));
  };

  const getTicketById = (ticketId: string) => {
    return userTickets.find(ticket => ticket.id === ticketId);
  };

  const getTicketsByEventId = (eventId: string) => {
    return userTickets.filter(ticket => ticket.eventId === eventId);
  };

  const getActiveTickets = () => {
    return userTickets.filter(ticket => ticket.status === 'active');
  };

  const getCancelledTickets = () => {
    return userTickets.filter(ticket => ticket.status === 'cancelled');
  };

  const getUsedTickets = () => {
    return userTickets.filter(ticket => ticket.status === 'used');
  };

  return (
    <TicketContext.Provider value={{
      userTickets,
      addTicket,
      cancelTicket,
      getTicketById,
      getTicketsByEventId,
      getActiveTickets,
      getCancelledTickets,
      getUsedTickets,
    }}>
      {children}
    </TicketContext.Provider>
  );
}; 