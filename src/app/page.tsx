"use client";

import { useState } from "react";
import ClockCollection from "@/components/ClockCollection";
import LoadingScreen from "@/components/LoadingScreen";
import AnimatedText from "@/components/AnimatedText";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import EventGrid from "@/components/EventGrid";
import WorkshopGrid from "@/components/WorkshopGrid";
import GlareHover from "@/components/ReactBits/GlareHover/GlareHover";
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
      <style jsx global>{`
        html,
        body {
          overflow-x: hidden;
          -webkit-overflow-scrolling: touch;
          touch-action: pan-y;
        }

        /* Ensure mobile scrolling works properly */
        @media (max-width: 768px) {
          body {
            position: relative;
            height: auto;
            min-height: 100vh;
          }
        }
      `}</style>
      {isLoading && (
        <LoadingScreen
          onLoadingComplete={handleLoadingComplete}
          loadingTasks={loadingTasks}
          minimumDisplayTime={500}
        />
      )}{" "}
      <div
        className={`relative min-h-screen w-full p-0 m-0 overflow-x-hidden ${
          isLoading ? "opacity-0 pointer-events-none" : "opacity-100"
        } transition-opacity duration-500`}
      >
        {/* Fixed background clock collection */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <ClockCollection
            mainClockSize={420}
            smallClockCount={60}
            onReady={handleClockCollectionReady}
          />
        </div>

        {/* Content layer - scrollable */}
        <div
          className="relative z-10 touch-pan-y"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {/* NavBar appears after animated text completes */}
          {showNavBar && <NavBar />}{" "}
          {/* Animated text that appears after clock is visible */}
          {showAnimatedText && (
            <>
              {/* First screen with animated text - NO BLUR */}
              <div className="w-full h-screen flex items-center justify-center relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <AnimatedText
                    text="TECH FIESTA"
                    delay={2000}
                    onAnimationComplete={handleTextAnimationComplete}
                  />
                </div>
                
                {/* Scroll for more info text */}
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-center">
                  <div className="text-white text-sm sm:text-base font-medium animate-bounce">
                    Scroll for more info
                  </div>
                  <div className="mt-2 flex justify-center">
                    <svg 
                      className="w-5 h-5 text-white animate-bounce" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M19 14l-7 7m0 0l-7-7m7 7V3" 
                      />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Scrollable content sections with seamless blur overlay */}
              <div className="bg-black/20 backdrop-blur-sm">
                {/* About section */}
                <section
                  id="about"
                  className="w-full min-h-screen flex items-center justify-center py-8 sm:py-16"
                >
                <div className="text-center text-white max-w-4xl px-4 sm:px-6">
                  <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6">
                    About Tech Fiesta
                  </h2>
                  <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 leading-relaxed">
                    Discover the future of technology at our premier tech
                    festival. Join innovators, creators, and tech enthusiasts
                    from around the world for an unforgettable experience of
                    learning, networking, and innovation.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12">
                    <GlareHover
                      width="100%"
                      height="auto"
                      background="rgba(255, 255, 255, 0.1)"
                      borderRadius="0.5rem"
                      borderColor="rgba(255, 255, 255, 0.2)"
                      glareColor="#9333ea"
                      glareOpacity={0.4}
                      glareAngle={-45}
                      transitionDuration={600}
                    >
                      <div className="rounded-lg p-6">
                        <div className="text-3xl font-bold text-purple-400 mb-2">
                          500+
                        </div>
                        <div className="text-gray-300">Attendees Expected</div>
                      </div>
                    </GlareHover>
                    <GlareHover
                      width="100%"
                      height="auto"
                      background="rgba(255, 255, 255, 0.1)"
                      borderRadius="0.5rem"
                      borderColor="rgba(255, 255, 255, 0.2)"
                      glareColor="#3b82f6"
                      glareOpacity={0.4}
                      glareAngle={-45}
                      transitionDuration={600}
                    >
                      <div className="rounded-lg p-6">
                        <div className="text-3xl font-bold text-blue-400 mb-2">
                          20+
                        </div>
                        <div className="text-gray-300">Industry Speakers</div>
                      </div>
                    </GlareHover>
                    <GlareHover
                      width="100%"
                      height="auto"
                      background="rgba(255, 255, 255, 0.1)"
                      borderRadius="0.5rem"
                      borderColor="rgba(255, 255, 255, 0.2)"
                      glareColor="#22c55e"
                      glareOpacity={0.4}
                      glareAngle={-45}
                      transitionDuration={600}
                    >
                      <div className="rounded-lg p-6">
                        <div className="text-3xl font-bold text-green-400 mb-2">
                          3
                        </div>
                        <div className="text-gray-300">Days of Innovation</div>
                      </div>
                    </GlareHover>
                  </div>
                </div>                </section>
                
                {/* Events section */}
                <section
                  id="events"
                  className="w-full min-h-screen py-12 sm:py-20 px-4"
                >
                  <div className="max-w-7xl mx-auto">
                    <EventGrid
                      events={events}
                      title="Featured Events"
                      showFilter={true}
                    />
                  </div>
                </section>
                
                {/* Workshops section */}
                <section
                  id="workshops"
                  className="w-full min-h-screen py-12 sm:py-20 px-4"
                >
                  <div className="max-w-7xl mx-auto">
                    <WorkshopGrid
                      workshops={workshops.map((w) => ({
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
                
                {/* Footer */}
                <Footer />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
