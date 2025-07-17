import React from "react";
import { Workshop } from "@/types";
import { generateRegistrationUrl } from "@/utils/registration";
import SpotlightCard from "./ReactBits/SpotlightCard/SpotlightCard";

interface WorkshopCardProps {
  workshop: Workshop;
}

const WorkshopCard: React.FC<WorkshopCardProps> = ({ workshop }) => {
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const handleEnrollClick = () => {
    const registrationUrl = generateRegistrationUrl(workshop.id, "workshop");
    window.location.href = registrationUrl;
  };

  return (
    <SpotlightCard 
      className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105"
      spotlightColor="rgba(147, 51, 234, 0.4)"
    >
      {/* Header with Price */}
      <div className="flex justify-end items-start mb-4">
        <div className="text-right">
          <span className="text-lg font-bold text-white">{workshop.price}</span>
        </div>
      </div>
      {/* Workshop Title */}
      <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
        {workshop.title}
      </h3>
      {/* Category and Duration */}
      <div className="flex items-center gap-4 mb-3 text-sm text-gray-300">
        <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
          {workshop.category}
        </span>
        <span className="flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
          {workshop.duration}
        </span>
      </div>
      {/* Description */}
      <p className="text-gray-300 text-sm mb-4 line-clamp-3">
        {workshop.description}
      </p>
      {/* Prerequisites */}
      {workshop.prerequisites && workshop.prerequisites.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-white mb-2">
            Prerequisites:
          </h4>
          <div className="flex flex-wrap gap-1">
            {workshop.prerequisites
              .slice(0, 2)
              .map((prereq: string, index: number) => (
                <span
                  key={index}
                  className="bg-orange-500/20 text-orange-300 px-2 py-1 rounded text-xs"
                >
                  {prereq}
                </span>
              ))}
            {workshop.prerequisites.length > 2 && (
              <span className="text-xs text-gray-400 px-2 py-1">
                +{workshop.prerequisites.length - 2} more
              </span>
            )}
          </div>
        </div>
      )}
      {/* Tags */}
      {workshop.tags && workshop.tags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {workshop.tags.slice(0, 3).map((tag: string, index: number) => (
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
      {/* Registration Section */}
      <div className="pt-4 border-t border-white/10">
        <div className="flex justify-end">
          <button 
            onClick={handleEnrollClick}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
          >
            Enroll Now
          </button>
        </div>
      </div>
    </SpotlightCard>
  );
};

export default WorkshopCard;
