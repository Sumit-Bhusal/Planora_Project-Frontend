import React, { useState } from "react";
import { useEvents } from "../../contexts/EventContext";
import Input from "../UI/Input";
import Button from "../UI/Button";
import Card from "../UI/Card";
import { Event } from "../../types";

interface EditEventModalProps {
  event: Event;
  onClose: () => void;
}

const EditEventModal: React.FC<EditEventModalProps> = ({ event, onClose }) => {
  const { updateEvent, deleteEvent } = useEvents();
  const [formData, setFormData] = useState({
    title: event.title,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    city: event.city,
    venue: event.venue,
    venueType: event.venueType,
    ticketPrice: String(event.ticketPrice),
    maxAttendees: String(event.maxAttendees),
    imageUrl: event.imageUrl || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await updateEvent(event.id, {
        ...formData,
        ticketPrice: Number(formData.ticketPrice),
        maxAttendees: Number(formData.maxAttendees),
      });
      onClose();
    } catch (err) {
      setError("Failed to update event. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      await deleteEvent(event.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Edit Event</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Event Title"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            required
          />
          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            required
          />
          <Input
            label="Start Date"
            type="datetime-local"
            value={formData.startDate}
            onChange={(e) => handleInputChange("startDate", e.target.value)}
            required
          />
          <Input
            label="End Date"
            type="datetime-local"
            value={formData.endDate}
            onChange={(e) => handleInputChange("endDate", e.target.value)}
          />
          <Input
            label="City"
            value={formData.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
            required
          />
          <Input
            label="Venue"
            value={formData.venue}
            onChange={(e) => handleInputChange("venue", e.target.value)}
            required
          />
          <Input
            label="Venue Type"
            value={formData.venueType}
            onChange={(e) => handleInputChange("venueType", e.target.value)}
            required
          />
          <Input
            label="Ticket Price (NPR)"
            type="number"
            value={formData.ticketPrice}
            onChange={(e) => handleInputChange("ticketPrice", e.target.value)}
            required
          />
          <Input
            label="Maximum Attendees"
            type="number"
            value={formData.maxAttendees}
            onChange={(e) => handleInputChange("maxAttendees", e.target.value)}
            required
          />
          <Input
            label="Image URL"
            value={formData.imageUrl}
            onChange={(e) => handleInputChange("imageUrl", e.target.value)}
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" variant="danger" onClick={handleDelete}>
              Delete
            </Button>
            <Button type="submit" loading={isLoading}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventModal; 