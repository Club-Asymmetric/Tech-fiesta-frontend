'use client';

import { useState } from 'react';
import ClockCollection from "@/components/ClockCollection";
import LoadingScreen from "@/components/LoadingScreen";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [clockCollectionReady, setClockCollectionReady] = useState(false);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const handleClockCollectionReady = () => {
    setClockCollectionReady(true);
  };

  // Define loading tasks to track
  const loadingTasks = [
    { name: 'Clock Collection', completed: clockCollectionReady },
  ];  return (
    <>
      {isLoading && (
        <LoadingScreen 
          onLoadingComplete={handleLoadingComplete}
          loadingTasks={loadingTasks}
          minimumDisplayTime={500}
        />
      )}
      <div 
        className={`min-h-screen w-full p-0 m-0 overflow-hidden ${isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-500`}
      >
        <ClockCollection 
          mainClockSize={420} 
          smallClockCount={60} 
          onReady={handleClockCollectionReady}
        />
      </div>
    </>
  );
}
