'use client';

import { useState } from 'react';
import ClockCollection from "@/components/ClockCollection";
import SymmCollection from "@/components/SymmCollection";
import LoadingScreen from "@/components/LoadingScreen";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [clockCollectionReady, setClockCollectionReady] = useState(false);
  const [symmCollectionReady, setSymmCollectionReady] = useState(false);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const handleClockCollectionReady = () => {
    setClockCollectionReady(true);
  };

  const handleSymmCollectionReady = () => {
    setSymmCollectionReady(true);
  };

  // Define loading tasks to track
  const loadingTasks = [
    { name: 'Clock Collection', completed: clockCollectionReady },
    { name: 'Symmetry Collection', completed: symmCollectionReady }
  ];  return (
    <>
      {isLoading && (
        <LoadingScreen 
          onLoadingComplete={handleLoadingComplete}
          loadingTasks={loadingTasks}
          minimumDisplayTime={800}
        />
      )}
      <div 
        className={`min-h-screen w-full p-0 m-0 overflow-hidden ${isLoading ? 'hidden' : ''}`}
      >
        <ClockCollection 
          mainClockSize={420} 
          smallClockCount={24} 
          onReady={handleClockCollectionReady}
        />
        <SymmCollection 
          mainClockSize={420} 
          smallClockCount={24} 
          onReady={handleSymmCollectionReady}
        />
      </div>
    </>
  );
}
