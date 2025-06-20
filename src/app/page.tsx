"use client";

import { useState } from "react";
import ClockCollection from "@/components/ClockCollection";
import LoadingScreen from "@/components/LoadingScreen";
import AnimatedText from "@/components/AnimatedText";
import NavBar from "@/components/NavBar";

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
              </div>
              {/* Additional content sections for scrolling */}
              <section className="w-full min-h-screen flex items-center justify-center bg-black/20 backdrop-blur-sm">
                <div className="text-center text-white">
                  <h2 className="text-6xl font-bold mb-4">About</h2>
                  <p className="text-xl max-w-2xl">
                    Discover the future of technology at our premier tech
                    festival. Join innovators, creators, and tech enthusiasts
                    from around the world.
                  </p>
                </div>
              </section>
              <section className="w-full min-h-screen flex items-center justify-center bg-black/20 backdrop-blur-sm">
                <div className="text-center text-white">
                  <h2 className="text-6xl font-bold mb-4">Events</h2>
                  <p className="text-xl max-w-2xl">
                    Experience cutting-edge demos, keynote speeches, and
                    networking opportunities with industry leaders and
                    breakthrough technologies.
                  </p>
                </div>
              </section>
              <section className="w-full min-h-screen flex items-center justify-center bg-black/20 backdrop-blur-sm">
                <div className="text-center text-white">
                  <h2 className="text-6xl font-bold mb-4">Workshops</h2>
                  <p className="text-xl max-w-2xl">
                    Hands-on learning experiences in AI, blockchain, web
                    development, and emerging technologies. Learn from experts
                    and build real projects.
                  </p>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </>
  );
}
