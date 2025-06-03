"use client";

import { useEffect, useState } from "react";

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
  loadingTasks?: {
    name: string;
    completed: boolean;
  }[];
  minimumDisplayTime?: number;
}

// Predefined positions and animations to avoid hydration issues
const backgroundClocks = [
  { left: 15, top: 25, duration: 3.2, delay: 0.5, handSpeed: 2.1 },
  { left: 85, top: 15, duration: 4.1, delay: 1.2, handSpeed: 2.8 },
  { left: 70, top: 80, duration: 3.8, delay: 0.8, handSpeed: 2.3 },
  { left: 25, top: 75, duration: 3.5, delay: 1.5, handSpeed: 2.6 },
  { left: 90, top: 40, duration: 4.3, delay: 0.3, handSpeed: 2.2 },
  { left: 10, top: 60, duration: 3.7, delay: 1.8, handSpeed: 2.9 },
  { left: 60, top: 20, duration: 4.0, delay: 0.7, handSpeed: 2.4 },
  { left: 40, top: 90, duration: 3.3, delay: 1.1, handSpeed: 2.7 },
  { left: 80, top: 65, duration: 3.9, delay: 0.4, handSpeed: 2.0 },
  { left: 30, top: 35, duration: 4.2, delay: 1.7, handSpeed: 2.5 },
  { left: 95, top: 85, duration: 3.6, delay: 0.9, handSpeed: 2.8 },
  { left: 5, top: 10, duration: 4.4, delay: 1.3, handSpeed: 2.1 },
  { left: 55, top: 55, duration: 3.4, delay: 0.6, handSpeed: 2.6 },
  { left: 75, top: 30, duration: 4.1, delay: 1.9, handSpeed: 2.3 },
  { left: 20, top: 85, duration: 3.8, delay: 0.2, handSpeed: 2.9 },
  { left: 45, top: 5, duration: 3.7, delay: 1.4, handSpeed: 2.4 },
  { left: 65, top: 70, duration: 4.0, delay: 0.8, handSpeed: 2.2 },
  { left: 35, top: 45, duration: 3.5, delay: 1.6, handSpeed: 2.7 },
  { left: 85, top: 95, duration: 4.3, delay: 0.1, handSpeed: 2.5 },
  { left: 50, top: 25, duration: 3.9, delay: 1.0, handSpeed: 2.8 },
];

const LoadingScreen = ({
  onLoadingComplete,
  loadingTasks = [],
  minimumDisplayTime = 800,
}: LoadingScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [hasMinimumTimeElapsed, setHasMinimumTimeElapsed] = useState(false);
  const [initialProgress, setInitialProgress] = useState(20); // Start with some initial progress

  // Calculate progress based on completed tasks
  const completedTasks = loadingTasks.filter((task) => task.completed).length;
  const totalTasks = loadingTasks.length;

  // Calculate base progress from completed tasks
  const taskProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Show minimum initial progress if no tasks completed yet, otherwise show task progress
  const progress = taskProgress === 0 ? initialProgress : taskProgress;

  const allTasksCompleted = totalTasks > 0 && completedTasks === totalTasks;
  useEffect(() => {
    // Prevent scroll during loading
    document.body.style.overflow = "hidden";
    setIsMounted(true);

    // Set minimum display time
    const timer = setTimeout(() => {
      setHasMinimumTimeElapsed(true);
    }, minimumDisplayTime);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, [minimumDisplayTime]);
  // Gradually increase initial progress when no tasks are completed
  useEffect(() => {
    if (completedTasks === 0) {
      const interval = setInterval(() => {
        setInitialProgress((prev) => {
          const increment = Math.random() * 2 + 1; // Random increment between 1-3
          const nextProgress = prev + increment;
          return nextProgress > 50 ? 50 : nextProgress; // Cap at 50% for initial progress
        });
      }, 10); // Slightly slower updates for smoother animation

      return () => clearInterval(interval);
    }
  }, [completedTasks]);
  // Handle completion when all tasks are done and minimum time has elapsed
  useEffect(() => {
    if (allTasksCompleted && hasMinimumTimeElapsed) {
      // Always scroll to top before starting transition
      window.scrollTo(0, 0);

      onLoadingComplete?.(); // Call completion callback immediately when transition starts
      setIsTransitioning(true); // Start fade out transition

      setTimeout(() => {
        // Restore scroll and hide loading screen
        document.body.style.overflow = "";
        setIsVisible(false);
        // onLoadingComplete?.(); // Moved up
      }, 200); // Duration of the fade-out transition
    }
  }, [allTasksCompleted, hasMinimumTimeElapsed, onLoadingComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-black flex items-center justify-center transition-all duration-200 ease-in-out ${
        isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
      }`}
    >
      {/* Background pattern of small clocks */}
      {isMounted && (
        <div
          className={`absolute inset-0 opacity-10 transition-opacity duration-200 ${
            isTransitioning ? "opacity-0" : "opacity-10"
          }`}
        >
          {backgroundClocks.map((clock, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${clock.left}%`,
                top: `${clock.top}%`,
                animation: `float ${clock.duration}s ease-in-out infinite`,
                animationDelay: `${clock.delay}s`,
              }}
            >
              <div className="w-8 h-8 rounded-full border border-white bg-black relative">
                <div
                  className="absolute w-0.5 h-3 bg-white top-1 left-1/2 transform -translate-x-1/2 origin-bottom"
                  style={{
                    animation: `clockHand ${clock.handSpeed}s linear infinite`,
                  }}
                />
                <div className="absolute w-1 h-1 bg-blue-500 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}{" "}
      {/* Main loading clock */}{" "}
      <div
        className={`relative z-10 flex flex-col items-center transition-all duration-200 ${
          isTransitioning
            ? "opacity-0 transform translate-y-4 scale-95"
            : "opacity-100 transform translate-y-0 scale-100"
        }`}
      >
        <div className="relative">
          {/* Main clock face */}
          <div className="w-32 h-32 rounded-full border-4 border-white bg-black shadow-lg shadow-blue-500/20 relative">
            {/* Hour markers */}
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-4 bg-white"
                style={{
                  top: "8px",
                  left: "50%",
                  transformOrigin: "50% 56px",
                  transform: `translateX(-50%) rotate(${i * 30}deg)`,
                }}
              />
            ))}{" "}
            {/* Animated clock hands */}
            <div
              className="absolute w-1 h-8 bg-white top-1/2 left-1/2 origin-bottom"
              style={{
                transform: "translate(-50%, -100%) rotate(0deg)",
                animation: "hourHand 4s linear infinite",
                animationDelay: "0s",
              }}
            />
            <div
              className="absolute w-0.5 h-10 bg-white top-1/2 left-1/2 origin-bottom"
              style={{
                transform: "translate(-50%, -100%) rotate(90deg)",
                animation: "minuteHand 3s linear infinite",
                animationDelay: "0s",
              }}
            />
            <div
              className="absolute w-0.5 h-12 bg-red-500 top-1/2 left-1/2 origin-bottom"
              style={{
                transform: "translate(-50%, -100%) rotate(180deg)",
                animation: "secondHand 1s linear infinite",
                animationDelay: "0s",
              }}
            />
            {/* Center dot */}
            <div className="absolute w-3 h-3 bg-white rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
            </div>
          </div>

          {/* Progress ring */}
          <div className="absolute inset-0 w-32 h-32">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="rgba(59, 130, 246, 0.2)"
                strokeWidth="2"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="#3b82f6"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="283"
                strokeDashoffset={283 - (283 * progress) / 100}
                style={{
                  transition: "stroke-dashoffset 0.1s ease-out",
                }}
              />
            </svg>
          </div>
        </div>

        {/* Loading text */}
        <div className="mt-8 text-center">
          <div className="text-white text-xl font-light mb-2">
            Loading
            <span className="inline-block">
              <span className="animate-pulse">.</span>
              <span
                className="animate-pulse"
                style={{ animationDelay: "0.2s" }}
              >
                .
              </span>
              <span
                className="animate-pulse"
                style={{ animationDelay: "0.4s" }}
              >
                .
              </span>
            </span>
          </div>
          <div className="text-blue-400 text-sm">{Math.round(progress)}%</div>
        </div>
      </div>{" "}
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes secondHand {
          0% {
            transform: translate(-50%, -100%) rotate(180deg);
          }
          100% {
            transform: translate(-50%, -100%) rotate(540deg);
          }
        }

        @keyframes minuteHand {
          0% {
            transform: translate(-50%, -100%) rotate(90deg);
          }
          100% {
            transform: translate(-50%, -100%) rotate(450deg);
          }
        }

        @keyframes hourHand {
          0% {
            transform: translate(-50%, -100%) rotate(0deg);
          }
          100% {
            transform: translate(-50%, -100%) rotate(360deg);
          }
        }

        @keyframes clockHand {
          0% {
            transform: translateX(-50%) rotate(0deg);
          }
          100% {
            transform: translateX(-50%) rotate(360deg);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
