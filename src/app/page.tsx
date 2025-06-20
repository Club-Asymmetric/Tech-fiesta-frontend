"use client";

import { useState } from "react";
import ClockCollection from "@/components/ClockCollection";
import LoadingScreen from "@/components/LoadingScreen";
import AnimatedText from "@/components/AnimatedText";
import NavBar from "@/components/NavBar";
import EventGrid from "@/components/EventGrid";
import WorkshopGrid from "@/components/WorkshopGrid";
import { events } from "@/data/events";
import { workshops } from "@/data/workshops";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [clockCollectionReady, setClockCollectionReady] = useState(false);
  const [showAnimatedText, setShowAnimatedText] = useState(false);
  const [showNavBar, setShowNavBar] = useState(false);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    // Start the animated text after the loading is complete and clock is visible
    setTimeout(() => {
      setShowAnimatedText(true);
    }, 1000); // Show text 1 second after clock becomes visible
  };

  const handleClockCollectionReady = () => {
    setClockCollectionReady(true);
  };
  const handleTextAnimationComplete = () => {
    // Show NavBar immediately (no delay)
    setShowNavBar(true);

    console.log("Text animation completed");
  };
  // Define loading tasks to track
  const loadingTasks = [
    { name: "Clock Collection", completed: clockCollectionReady },
  ];

  return (
    <>
      {isLoading && (
        <LoadingScreen
          onLoadingComplete={handleLoadingComplete}
          loadingTasks={loadingTasks}
          minimumDisplayTime={500}
        />
      )}{" "}
      <div
        className={`relative min-h-screen w-full p-0 m-0 ${
          isLoading ? "opacity-0 pointer-events-none" : "opacity-100"
        } transition-opacity duration-500`}
      >
        {/* Fixed background clock collection */}
        <div className="fixed inset-0 z-0">
          <ClockCollection
            mainClockSize={420}
            smallClockCount={60}
            onReady={handleClockCollectionReady}
          />
        </div>

        {/* Content layer - scrollable */}
        <div className="relative z-10">
          {/* NavBar appears after animated text completes */}
          {showNavBar && <NavBar />}{" "}
          {/* Animated text that appears after clock is visible */}
          {showAnimatedText && (
            <>
              {/* First screen with animated text - fixed positioning to ensure it stays at the top */}
              <div className="w-full h-screen flex items-center justify-center relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <AnimatedText
                    text="TECH FIESTA"
                    delay={2000}
                    onAnimationComplete={handleTextAnimationComplete}
                  />
                </div>
              </div>{" "}
              {/* Additional content sections for scrolling */}
              <section
                id="about"
                className="w-full min-h-screen flex items-center justify-center bg-black/20 backdrop-blur-sm"
              >
                <div className="text-center text-white max-w-4xl px-4">
                  <h2 className="text-4xl sm:text-6xl font-bold mb-6">
                    About Tech Fiesta
                  </h2>
                  <p className="text-lg sm:text-xl mb-8 leading-relaxed">
                    Discover the future of technology at our premier tech
                    festival. Join innovators, creators, and tech enthusiasts
                    from around the world for an unforgettable experience of
                    learning, networking, and innovation.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
                    <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
                      <div className="text-3xl font-bold text-purple-400 mb-2">
                        500+
                      </div>
                      <div className="text-gray-300">Attendees Expected</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
                      <div className="text-3xl font-bold text-blue-400 mb-2">
                        20+
                      </div>
                      <div className="text-gray-300">Industry Speakers</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
                      <div className="text-3xl font-bold text-green-400 mb-2">
                        3
                      </div>
                      <div className="text-gray-300">Days of Innovation</div>
                    </div>
                  </div>
                </div>
              </section>{" "}
              <section
                id="events"
                className="w-full min-h-screen bg-black/20 backdrop-blur-sm py-20 px-4"
              >
                <div className="max-w-7xl mx-auto">
                  <EventGrid
                    events={events}
                    title="Featured Events"
                    showFilter={true}
                  />
                </div>
              </section>
              <section
                id="workshops"
                className="w-full min-h-screen bg-black/20 backdrop-blur-sm py-20 px-4"
              >
                <div className="max-w-7xl mx-auto">
                  <WorkshopGrid
                    workshops={workshops.map(w => ({
                      ...w,
                      level:
                        w.level === "Beginner" ||
                        w.level === "Intermediate" ||
                        w.level === "Advanced"
                          ? w.level
                          : undefined,
                    }))}
                    title="Hands-On Workshops"
                    showFilter={true}
                  />
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </>
  );
}
