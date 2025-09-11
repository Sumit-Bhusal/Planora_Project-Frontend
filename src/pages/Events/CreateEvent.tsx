import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Image,
  Tag,
  Save,
  Sparkles,
} from "lucide-react";
import { useEvents } from "../../contexts/EventContext";
import { useAuth } from "../../contexts/AuthContext";
import Input from "../../components/UI/Input";
import Button from "../../components/UI/Button";
import Card from "../../components/UI/Card";
import { useEffect } from "react";
import { format } from "date-fns";

function toDatetimeLocal(dateString: string) {
  if (!dateString) return "";
  return format(new Date(dateString), "yyyy-MM-dd'T'HH:mm");
}

const CreateEvent: React.FC = () => {
  const { createEvent, updateEvent, isEditing, editingEvent, setEditingEvent, fetchEvents } = useEvents();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    startDate: "",
    endDate: "",
    city: "",
    venue: "",
    venueType: "",
    venueSuitability: [] as string[],
    venueCapacity: "",
    venueAmbiance: "",
    venueLocationType: "",
    ticketPrice: "0",
    priceCategory: "",
    maxAttendees: "0",
    tags: "",
    imageUrl: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const categories = [
    "Technology",
    "Business",
    "Arts",
    "Sports",
    "Music",
    "Education",
    "Health & Wellness",
    "Photography",
    "Social"
  ];

  // Add options for enums
  const venueTypes = [
    "City Hall",
    "Resort",
    "Mall",
    "Heritage",
    "Banquet Hall",
    "Party Palace",
    "Hotel",
    "Exhibition Center",
    "Museum",
    "Convention Center"
  ];
  const venueSuitabilityOptions = [
    "Government",
    "Programs",
    "Lectures",
    "Expos",
    "Exhibitions",
    "Retreats",
    "Wellness",
    "Gatherings",
    "Parties",
    "Summits",
    "Weddings",
    "AIMeetups",
    "Receptions",
    "Conferences",
    "MegaWeddings",
    "Seminars",
    "HeritageExpos",
    "Workshops",
    "Camps",
    "CommunityEvents",
    "ArtTech",
    "Fairs"
  ];
  const venueCapacities = ["Small", "Medium", "Large"];
  const venueAmbiances = ["Casual", "Formal", "Rustic", "Modern", "Elegant", "Industrial", "Outdoor", "Indoor", "Cozy", "Vibrant", "Sophisticated", "Intimate", "Luxurious", "Minimalist", "Artistic", "Themed", "Classic", "Trendy", "Eclectic", "Unique", "Professional", "Relaxed", "Welcoming", "Lively", "Serene", "Chic", "Contemporary", "Rustic Chic", "Vintage", "Bohemian", "Urban", "Coastal", "Mountain", "Garden", "Beach", "Forest"];
  const venueLocationTypes = ["Urban", "Suburban", "Rural", "Waterfront", "Mountainous", "Forested", "Desert", "Coastal", "Countryside", "CityCenter", "Downtown", "HistoricDistrict"];
  const priceCategories = ["Free", "Cheap", "Medium", "Expensive", "VeryExpensive", "Premium", "Luxury", "Exclusive", "VIP"];

  const venues = [
    { name: "Hotel Yak & Yeti", address: "Durbar Marg, Kathmandu 44600" },
    { name: "Bhrikuti Mandap Exhibition Hall", address: "Exhibition Road, Kathmandu 44600" },
    { name: "Soaltee Kathmandu (Autograph Collection)", address: "Tahachal‑13, Kathmandu 44600" },
    { name: "The Malla Hotel", address: "Lekhnath Marg, Kathmandu 44600" },
    { name: "Rastriya Sabha Griha (City Hall)", address: "Kathmandu‑28, Kathmandu 44600" },
    { name: "Pokhara Grande Hotel", address: "Birauta Chowk, Pardi-17, Pokhara" },
    { name: "International Mountain Museum", address: "Ratopairo, Pokhara 33700" },
    { name: "Hotel Barahi Conference Hall", address: "Lakeside Pokhara, near Fewa Lake, Pokhara 33700" },
    { name: "Annapurna Events Centre", address: "Shrikrishna Marga, Bulaudai - 6, Pokhara" },
    { name: "Temple Tree Resort & Spa", address: "Gaurighat-6, Lakeside Pokhara" },
    { name: "Patan Museum Courtyard", address: "Patan Durbar Square, UNESCO core zone, Lalitpur" },
    { name: "The Summit Hotel", address: "Patan, Lalitpur" },
    { name: "Godavari Village Resort", address: "Godavari‑3, Lalitpur (12–13 km SE of Kathmandu center)" },
    { name: "Labim Mall Event Spaces", address: "Pulchowk, Lalitpur (Labim Mall complex)" },
    { name: "Hotel Himalaya", address: "Kupondole Height, Lalitpur" },
    { name: "Bhaktapur Durbar Square Courtyard", address: "Durbar Square, Bhaktapur‑11 (Nyatapola), UNESCO zone" },
    { name: "Vajra Hotel & Convention Centre", address: "Off Nagarkot Road, Bhaktapur municipality" },
    { name: "Heritage Banquet Bhaktapur", address: "Near Ring Road, Bhaktapur" },
    { name: "Peace Land Party Palace", address: "Suburban Bhaktapur (exact street needs local validation)" },
    { name: "Nagarkot Farm House", address: "Nagarkot‑2, Bhaktapur District (~12 km NE from city center)" },
    { name: "Bharatpur Garden Resort", address: "Bharatpur‑10 (Bharatpur Height), Chitwan" },
    { name: "Hotel Royal Century", address: "Bharatpur Height, Bharatpur 44600" },
    { name: "Chitwan Expo Center", address: "Bharatpur‑10, Chitwan" },
    { name: "Green Park Chitwan", address: "Sauraha‑15, Chitwan (near National Park entry)" },
    { name: "Rhino Residency Resort", address: "Sauraha‑15, Chitwan" },
    { name: "Butwal International Convention Centre (BICC)", address: "~500 m east of Butwal city center, Siddhartha Highway (Butwal‑6)" },
    { name: "Hotel Da Flamingo", address: "Jogikuti, Butwal 44600" },
    { name: "Dreamland Gold Resort & Hotel", address: "Tilottama‑5, Manigram, Rupandehi" },
    { name: "Hotel Tulip", address: "Nar and Malla Path, Jogikuti, Butwal 32907" },
    { name: "Hotel Avenue", address: "Golpark‑5, ~1.8 km west of Butwal center" },
  ];

  useEffect(() => {
    if (editingEvent && editingEvent.id) {
      setFormData({
        title: editingEvent.title || "",
        description: editingEvent.description || "",
        category: editingEvent.category || "",
        startDate: toDatetimeLocal(editingEvent.startDate) || "",
        endDate: toDatetimeLocal(editingEvent.endDate) || "",
        city: editingEvent.city || "",
        venue: editingEvent.venue || "",
        venueType: editingEvent.venueType || "",
        venueSuitability: editingEvent.venueSuitability || [],
        venueCapacity: editingEvent.venueCapacity || "",
        venueAmbiance: editingEvent.venueAmbiance || "",
        venueLocationType: editingEvent.venueLocationType || "",
        ticketPrice: editingEvent.ticketPrice ? String(editingEvent.ticketPrice) : "0",
        priceCategory: editingEvent.priceCategory || "",
        maxAttendees: editingEvent.maxAttendees ? String(editingEvent.maxAttendees) : "0",
        tags: (editingEvent.tags || []).join(", "),
        imageUrl: editingEvent.imageUrl || "",
      });
    }
    // Do NOT clear editingEvent here!
    // Only clear after update or cancel.
    // eslint-disable-next-line
  }, [editingEvent]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (
      !formData.title ||
      !formData.description ||
      !formData.category ||
      !formData.startDate ||
      !formData.city ||
      !formData.venue ||
      !formData.venueType ||
      !formData.venueSuitability.length ||
      !formData.venueCapacity ||
      !formData.venueAmbiance ||
      !formData.venueLocationType ||
      !formData.ticketPrice ||
      !formData.priceCategory ||
      !formData.maxAttendees
    ) {
      setError("Please fill in all required fields");
      return false;
    }

    if (new Date(formData.startDate) <= new Date()) {
      setError("Event date must be in the future");
      return false;
    }

    if (
      formData.endDate &&
      new Date(formData.endDate) <= new Date(formData.startDate)
    ) {
      setError("End date must be after start date");
      return false;
    }

    if (parseFloat(formData.ticketPrice) < 0) {
      setError("Ticket price cannot be negative");
      return false;
    }

    if (parseInt(formData.maxAttendees) < 1) {
      setError("Maximum attendees must be at least 1");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("You must be logged in to create an event");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const eventData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        startDate: formData.startDate,
        endDate: formData.endDate,
        city: formData.city,
        venue: formData.venue,
        venueType: formData.venueType,
        venueSuitability: formData.venueSuitability,
        venueCapacity: formData.venueCapacity,
        venueAmbiance: formData.venueAmbiance,
        venueLocationType: formData.venueLocationType,
        ticketPrice: Number(formData.ticketPrice),
        priceCategory: formData.priceCategory,
        maxAttendees: Number(formData.maxAttendees),
        tags: formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        imageUrl: formData.imageUrl,
      };
      if (editingEvent && editingEvent.id) {
        await updateEvent(editingEvent.id, eventData);
        await fetchEvents();
        setEditingEvent(null);
      } else {
        await createEvent(eventData);
        await fetchEvents();
      }
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to save event. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Sparkles className="h-12 w-12 text-primary-600 dark:text-primary-400 animate-pulse" />
                <div className="absolute inset-0 bg-primary-600 dark:bg-primary-400 rounded-full opacity-20 animate-ping"></div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Create New Event
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Fill in the details to create your amazing event
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                    Basic Information
                  </h2>
                  <div className="space-y-4">
                    <Input
                      label="Event Title"
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      placeholder="Enter event title"
                      required
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        placeholder="Describe your event..."
                        rows={4}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400 focus:outline-none transition-colors duration-200"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          handleInputChange("category", e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400 focus:outline-none transition-colors duration-200"
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>

                    <Input
                      label="Tags"
                      value={formData.tags}
                      onChange={(e) =>
                        handleInputChange("tags", e.target.value)
                      }
                      placeholder="Enter tags separated by commas"
                      icon={Tag}
                    />
                  </div>
                </Card>
                {/* Venue Details */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                    Venue Details
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Venue Type <span className="text-red-500">*</span></label>
                      <select
                        value={formData.venueType}
                        onChange={(e) => handleInputChange("venueType", e.target.value)}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        required
                      >
                        <option value="">Select venue type</option>
                        {venueTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Venue Suitability <span className="text-red-500">*</span></label>
                      <div className="flex flex-wrap gap-2">
                        {venueSuitabilityOptions.map((option) => (
                          <label key={option} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.venueSuitability.includes(option)}
                              onChange={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  venueSuitability: prev.venueSuitability.includes(option)
                                    ? prev.venueSuitability.filter((v) => v !== option)
                                    : [...prev.venueSuitability, option],
                                }));
                              }}
                            />
                            <span className="ml-2">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Venue Capacity <span className="text-red-500">*</span></label>
                      <select
                        value={formData.venueCapacity}
                        onChange={(e) => handleInputChange("venueCapacity", e.target.value)}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        required
                      >
                        <option value="">Select capacity</option>
                        {venueCapacities.map((cap) => (
                          <option key={cap} value={cap}>{cap}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Venue Ambiance <span className="text-red-500">*</span></label>
                      <select
                        value={formData.venueAmbiance}
                        onChange={(e) => handleInputChange("venueAmbiance", e.target.value)}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        required
                      >
                        <option value="">Select ambiance</option>
                        {venueAmbiances.map((amb) => (
                          <option key={amb} value={amb}>{amb}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Venue Location Type <span className="text-red-500">*</span></label>
                      <select
                        value={formData.venueLocationType}
                        onChange={(e) => handleInputChange("venueLocationType", e.target.value)}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        required
                      >
                        <option value="">Select location type</option>
                        {venueLocationTypes.map((loc) => (
                          <option key={loc} value={loc}>{loc}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price Category <span className="text-red-500">*</span></label>
                      <select
                        value={formData.priceCategory}
                        onChange={(e) => handleInputChange("priceCategory", e.target.value)}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        required
                      >
                        <option value="">Select price category</option>
                        {priceCategories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </Card>
              </div>
              {/* Sidebar */}
              <div className="space-y-6">
                {/* Date & Time */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                    Date & Time
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Start Date & Time{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="datetime-local"
                        value={formData.startDate}
                        onChange={(e) =>
                          handleInputChange("startDate", e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400 focus:outline-none transition-colors duration-200"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        End Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        value={formData.endDate}
                        onChange={(e) =>
                          handleInputChange("endDate", e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400 focus:outline-none transition-colors duration-200"
                      />
                    </div>
                  </div>
                </Card>
                {/* City and Venue */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                    Location
                  </h2>
                  <div className="space-y-4">
                    <Input
                      label="City"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      placeholder="Enter city"
                      required
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Venue Name <span className="text-red-500">*</span></label>
                      <select
                        value={formData.venue}
                        onChange={(e) => handleInputChange("venue", e.target.value)}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        required
                      >
                        <option value="">Select a venue</option>
                        {venues.map((venue) => (
                          <option key={venue.name} value={venue.name}>{venue.name}</option>
                        ))}
                      </select>
                      {formData.venue && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          {venues.find((v) => v.name === formData.venue)?.address}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
                {/* Pricing & Capacity */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                    Pricing & Capacity
                  </h2>
                  <div className="space-y-4">
                    <Input
                      label="Ticket Price (NPR)"
                      type="number"
                      value={formData.ticketPrice}
                      onChange={(e) => handleInputChange("ticketPrice", e.target.value)}
                      placeholder="0"
                      icon={DollarSign}
                      required
                    />
                    <Input
                      label="Maximum Attendees"
                      type="number"
                      value={formData.maxAttendees}
                      onChange={(e) => handleInputChange("maxAttendees", e.target.value)}
                      placeholder="Maximum attendees"
                      icon={Users}
                      required
                    />
                  </div>
                </Card>
                {/* Event Image */}
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Image className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                    Event Image
                  </h2>
                  <Input
                    label="Image URL"
                    value={formData.imageUrl}
                    onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    icon={Image}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Leave empty to use a default image
                  </p>
                </Card>
                {/* Actions */}
                <Card className="p-6">
                  <div className="space-y-3">
                    {error && (
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                        {error}
                      </div>
                    )}
                    <Button
                      type="submit"
                      className="w-full"
                      loading={isLoading}
                      icon={Save}
                    >
                      {isEditing ? "Save Changes" : "Create Event"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => navigate("/dashboard")}
                    >
                      Cancel
                    </Button>
                  </div>
                </Card>
                {/* Tips */}
                <Card className="p-6 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-primary-200 dark:border-primary-800">
                  <h3 className="text-sm font-semibold text-primary-900 dark:text-primary-300 mb-2 flex items-center">
                    <Sparkles className="h-4 w-4 mr-1" />
                    Tips for Success
                  </h3>
                  <ul className="text-xs text-primary-700 dark:text-primary-400 space-y-1">
                    <li>• Use a clear, descriptive title</li>
                    <li>• Add relevant tags for better discovery</li>
                    <li>• Set competitive pricing</li>
                    <li>• Choose an attractive venue</li>
                    <li>• Provide detailed description</li>
                  </ul>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Payment Modal */}
      {/* Removed PaymentModal */}
    </>
  );
};

export default CreateEvent;
