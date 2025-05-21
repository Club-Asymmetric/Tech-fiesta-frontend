"use client";

import React, { useEffect, useState } from 'react';
import AnalogClock from './AnalogClock';

interface ClockCollectionProps {
  mainClockSize?: number;
  smallClockCount?: number;
}

const ClockCollection = ({ 
  mainClockSize = 400, 
  smallClockCount = 20 
}: ClockCollectionProps) => {
  // Initialize with null to avoid hydration mismatch
  const [viewportSize, setViewportSize] = useState<{ width: number, height: number } | null>(null);

  // Update viewport size on window resize
  useEffect(() => {
    const handleResize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    // Set initial size
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  // Pseudo-random number generator with seed for stable values across server and client
  const seededRandom = (seed: number) => {
    // Simple seeded random function
    return function() {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
  };
  // Generate clock positions and sizes
  const generateClocks = () => {
    const clocks = [];
    const safeZone = mainClockSize * 0.7;
    // Use default values if viewportSize is null (during SSR)
    const width = viewportSize?.width || 1200;
    const height = viewportSize?.height || 800;
    const maxX = width * 0.9;
    const maxY = height * 0.9;
    
    // Size ranges for small clocks
    const minSize = 100;
    const maxSize = 200;
    
    // Create a seeded random generator (fixed seed for consistency)
    const random = seededRandom(12345);
    
    // Generate positions for small clocks
    for (let i = 0; i < smallClockCount; i++) {
      // Use seed-based random position, avoiding center
      let x, y, distanceFromCenter;
      
      do {
        x = random() * maxX - (maxX / 2);
        y = random() * maxY - (maxY / 2);
        distanceFromCenter = Math.sqrt(x * x + y * y);
      } while (distanceFromCenter < safeZone);
      
      // Random size (larger than before) using seeded random
      const size = Math.floor(minSize + random() * (maxSize - minSize));
      
      // Scale hand thickness proportionally
      const hourHandThickness = size / 90;  
      const minuteHandThickness = size / 130;
      const secondHandThickness = size / 180;
      
      clocks.push({
        x, 
        y, 
        size, 
        hourHandThickness, 
        minuteHandThickness, 
        secondHandThickness
      });
    }
    
    return clocks;
  };
  // Only generate clocks on the client side
  // Use memo to avoid recalculating on every render
  const smallClocks = React.useMemo(() => {
    // Only generate clocks if we're in the browser
    if (typeof window !== 'undefined' && viewportSize) {
      return generateClocks();
    }
    return [];
  }, [viewportSize?.width, viewportSize?.height]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Main clock in center */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <AnalogClock 
          size={mainClockSize} 
          hourHandThickness={mainClockSize / 120}
          minuteHandThickness={mainClockSize / 180}
          secondHandThickness={mainClockSize / 240}
        />
      </div>
      
      {/* Smaller clocks - only render on client side after hydration */}
      {typeof window !== 'undefined' && smallClocks.map((clock, i) => (
        <div 
          key={i}
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `calc(50% + ${clock.x}px)`,
            top: `calc(50% + ${clock.y}px)`,
          }}
        >
          <AnalogClock 
            size={clock.size}
            hourHandThickness={clock.hourHandThickness}
            minuteHandThickness={clock.minuteHandThickness}
            secondHandThickness={clock.secondHandThickness}
          />
        </div>
      ))}
    </div>
  );
};

export default ClockCollection;
