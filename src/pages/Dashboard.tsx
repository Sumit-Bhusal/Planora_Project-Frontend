import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useEvents } from "../contexts/EventContext";
import { useTickets } from "../contexts/TicketContext";
import UserDashboard from "./UserDashboard";
import OrganizerDashboard from "./OrganizerDashboard";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { registerForEvent, organizerEvents, startEditingEvent } = useEvents();
  const { getActiveTickets } = useTickets();
  const navigate = useNavigate();

  if (!user) return null;

  const isOrganizer = user.role === "organizer";
  const activeTickets = getActiveTickets();
  const recommendedEvents: any[] = [];

  const handleEventEdit = (event: any) => {
    startEditingEvent(event);
    navigate("/create-event");
  };

  return isOrganizer ? (
    <OrganizerDashboard
      key={`organizer-${organizerEvents.length}`}
      user={user}
      organizerEvents={organizerEvents}
      handleManageAttendees={() => {}}
      handleShareEvents={() => {}}
      handleEventEdit={handleEventEdit}
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
