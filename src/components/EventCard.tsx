import React from "react";
import { Event } from "@/types";
import { generateRegistrationUrl } from "@/utils/registration";
import SpotlightCard from "./ReactBits/SpotlightCard/SpotlightCard";

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const handleRegisterClick = () => {
    const eventType = event.type === "tech" ? "event" : "non-tech";
    const registrationUrl = generateRegistrationUrl(event.id, eventType);
    window.location.href = registrationUrl;
  };

  return (
    <SpotlightCard 
      className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105"
      spotlightColor={
        event.type === "tech" 
          ? "rgba(59, 130, 246, 0.4)" // Blue spotlight for tech events
          : "rgba(34, 197, 94, 0.4)"  // Green spotlight for non-tech events
      }
    >
      {/* Event Type Badge */}
      <div className="flex justify-start items-start mb-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            event.type === "tech"
              ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
              : "bg-green-500/20 text-green-300 border border-green-500/30"
          }`}
        >
          {event.type === "tech" ? "Tech Event" : "Non-Tech Event"}
        </span>
      </div>
      {/* Event Title */}
      <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
        {event.title}
      </h3>      
      {/* Description */}
      <p className="text-gray-300 text-sm mb-4 line-clamp-3">
        {event.description}
      </p>
      {/* Tags */}
      {event.tags && event.tags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {event.tags.slice(0, 3).map((tag: string, index: number) => (
              <span
                key={index}
                className="bg-gray-500/20 text-gray-300 px-2 py-1 rounded-full text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}{" "}
      {/* Registration Info */}
      <div className="flex justify-end pt-4 border-t border-white/10">
        <button 
          onClick={handleRegisterClick}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
        >
          Register Now
        </button>
      </div>
    </SpotlightCard>
  );
};

export default EventCard;
