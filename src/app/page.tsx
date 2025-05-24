'use client';

import { useState } from 'react';
import ClockCollection from "@/components/ClockCollection";
import SymmCollection from "@/components/SymmCollection";
import LoadingScreen from "@/components/LoadingScreen";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };
  return (
    <>
      {isLoading && (
        <LoadingScreen 
          onLoadingComplete={handleLoadingComplete}
          minimumLoadTime={3000}
        />
      )}
      <div 
        className={`min-h-screen w-full p-0 m-0 overflow-hidden ${isLoading ? 'hidden' : ''}`}
      >
        <ClockCollection mainClockSize={420} smallClockCount={24} />
        <SymmCollection mainClockSize={420} smallClockCount={24} />
      </div>
    </>
  );
}
