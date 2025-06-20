import React from "react";
import { Event } from "@/types";

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

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
      {" "}
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
      {/* Event Details */}
      <div className="space-y-2 mb-4 text-gray-300">
        <div className="flex items-center text-sm">
          <svg
            className="w-4 h-4 mr-2 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clipRule="evenodd"
            />
          </svg>
          <span>{formatDate(event.date)}</span>
        </div>
        <div className="flex items-center text-sm">
          <svg
            className="w-4 h-4 mr-2 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
          <span>{event.time}</span>
        </div>
        <div className="flex items-center text-sm">
          <svg
            className="w-4 h-4 mr-2 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          <span>{event.venue}</span>
        </div>
      </div>
      {/* Description */}
      <p className="text-gray-300 text-sm mb-4 line-clamp-3">
        {event.description}
      </p>
      {/* Speakers */}
      {event.speakers && event.speakers.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-white mb-2">Speakers:</h4>
          <div className="flex flex-wrap gap-2">
            {event.speakers.map((speaker: string, index: number) => (
              <span
                key={index}
                className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs"
              >
                {speaker}
              </span>
            ))}
          </div>
        </div>
      )}
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
        <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105">
          Register Now
        </button>
      </div>
    </div>
  );
};

export default EventCard;
