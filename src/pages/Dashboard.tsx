import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useEvents } from "../contexts/EventContext";
import { useTickets } from "../contexts/TicketContext";
import UserDashboard from "./UserDashboard";
import OrganizerDashboard from "./OrganizerDashboard";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { registerForEvent, organizerEvents } = useEvents();
  const { getActiveTickets } = useTickets();

  if (!user) return null;

  const isOrganizer = user.role === "organizer";
  const activeTickets = getActiveTickets();
  const recommendedEvents: any[] = [];

  return isOrganizer ? (
    <OrganizerDashboard
      user={user}
      organizerEvents={organizerEvents}
      handleManageAttendees={() => {}}
      handleShareEvents={() => {}}
      handleEventEdit={() => {}}
      handleEventAnalytics={() => {}}
      handleEventShare={() => {}}
    />
  ) : (
    <UserDashboard
      user={user}
      activeTickets={activeTickets}
      recommendedEvents={recommendedEvents}
      registerForEvent={registerForEvent}
    />
  );
};

export default Dashboard;
