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
      )}
      <div
        className={`min-h-screen w-full p-0 m-0 overflow-hidden ${
          isLoading ? "opacity-0 pointer-events-none" : "opacity-100"
        } transition-opacity duration-500`}
      >
        {" "}
        <ClockCollection
          mainClockSize={420}
          smallClockCount={60}
          onReady={handleClockCollectionReady}
        />
        {/* NavBar appears after animated text completes */}
        {showNavBar && <NavBar />}{" "}
        {/* Animated text that appears after clock is visible */}
        {showAnimatedText && (
          <>
            <AnimatedText
              text="TECH FIESTA"
              delay={2000}
              onAnimationComplete={handleTextAnimationComplete}
            />
            <div className="w-screen h-screen" />
          </>
        )}
      </div>
    </>
  );
}
